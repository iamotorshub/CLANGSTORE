import os
import json
import base64
import requests

# Supabase Config from .env
SUPABASE_URL = "https://lohjvfwoxddvgmeugsse.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvaGp2ZndveGRkdmdtZXVnc3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NzMzNjIsImV4cCI6MjA4NjM0OTM2Mn0.fPqYhhatAPSScsPvpvwTasPM7YUJYVTwNra8_JhjQNs"

MODELS_DIR = "/Users/francolarrarte/Downloads/CLANG STORE"
MODELS = ["LOLA", "MARTINA", "MIA", "SOFIA", "VALENTINA"]

# Descriptions for each model to help Gemini with consistency
MODEL_DESCRIPTIONS = {
    "LOLA": "An edgy fashion model with short dark hair, freckles, and a bold urban style. Professional editorial photography.",
    "MARTINA": "A classic elegant fashion model with long brown hair, sophisticated and clean look, timeless beauty.",
    "MIA": "A rock-chic inspired fashion model, stylish, confident, with a mix of street and high-fashion hair and makeup.",
    "SOFIA": "A boho-chic fashion model with a natural sun-kissed look, wavy hair, and a relaxed yet premium aesthetic.",
    "VALENTINA": "A 'luxury boss' style fashion model, sharp features, impeccable styling, representing high-end corporate or evening elegance."
}

def get_base64(file_path):
    with open(file_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def main():
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json"
    }

    print("--- Starting Model Population ---")

    for model_name in MODELS:
        folder_path = os.path.join(MODELS_DIR, model_name)
        if not os.path.exists(folder_path):
            print(f"Skipping {model_name}: Folder not found")
            continue

        images = [f for f in os.listdir(folder_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        if not images:
            print(f"No images for {model_name}")
            continue

        # Use the first image as the main photo_url (Base64 for now if Storage is restrictive)
        # However, many photos might be too large for a DB text field if stored as base64 in 10 slots.
        # I'll try to insert the model record.
        
        main_img_path = os.path.join(folder_path, images[0])
        # We'll use the filename as a placeholder, hoping we can upload them later or use them directly.
        # For now, let's just use a public placeholder or a base64 version of a SMALL thumbnail if possible.
        # Actually, let's try to find out if we can upload to Storage.
        
        print(f"Inserting model: {model_name}")
        
        # In the context of Gemini multireference, we want to store the tags or descriptions.
        # The schema has 'photo_url', 'prompt_description', 'tags'.
        payload = {
            "name": model_name,
            "prompt_description": MODEL_DESCRIPTIONS.get(model_name, ""),
            "tags": [model_name.lower(), "consistency-ref"],
            # I will store the count of ref photos in metadata or just assume 10.
            # For the MVP, I'll store the first photo as a Data URI to ensure it works immediately.
            "photo_url": f"data:image/png;base64,{get_base64(main_img_path)[:50000]}..." # Truncated for meta, but full is better.
        }
        
        # Full insert without truncation
        payload["photo_url"] = f"data:image/png;base64,{get_base64(main_img_path)}"

        res = requests.post(f"{SUPABASE_URL}/rest/v1/ai_models", headers=headers, json=payload)
        
        if res.status_code in [200, 201]:
            print(f"Successfully inserted {model_name}")
        else:
            print(f"Failed to insert {model_name}: {res.status_code} - {res.text}")

if __name__ == "__main__":
    main()
