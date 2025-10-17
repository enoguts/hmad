import csv
import json
import time
import os
from openai import OpenAI

# --- Configuration ---

# NOTE: This script REQUIRES a file named 'comments_data.csv'
# with 'id' and 'comment' columns in the same directory.
INPUT_FILE = "comments_data.csv"
OUTPUT_FILE = "analyzed_comments.json"

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    # IMPORTANT: Use your actual API key
    api_key="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",
)

# --- LLM Analysis Prompt ---

ANALYSIS_PROMPT = """
Analyze the following post ID and comment text. You MUST return ONLY a single JSON object structured as follows, with the analysis keys filled based on the comment's content. The JSON must be valid and ready to be parsed by Python's json.loads(). Use the most appropriate language (e.g., Arabic, French) for the analysis fields when the comment is in that language.

REQUIRED JSON STRUCTURE:
{{
  "post_id": "{{id_placeholder}}",
  "comment": "{{comment_placeholder}}",
  "analysis": {{
    "sentiment": {{
      "overall_tone": "Positive/Negative/Neutral/Mixed",
      "breakdown": {{
        "positive_percent": 0,
        "negative_percent": 0,
        "neutral_percent": 0
      }},
      "commentary": "Explain the determined sentiment in English."
    }},
    "themes_and_topics": ["list", "of", "main", "subjects", "in", "English"],
    "viewer_questions": [
      {{"question": "The question translated to English.", "type": "Plot/Character/Technical..."}}
    ],
    "key_feedback": {{
      "type": "Summary/Engagement/Criticism",
      "summary": "One sentence distilling the core feedback in English.",
      "emotion_words": ["list", "of", "key", "words", "from", "original", "comment"]
    }},
    "actionable_insights": [
      "list of concrete suggestions for the content team in English"
    ]
  }}
}}

Analyze the provided data: 
Post ID: {{id_placeholder}}
Comment: {{comment_placeholder}}
"""


# --- Main Analysis Function ---

def analyze_comments(input_file, output_file):
    """
    Reads a CSV, analyzes each comment using the LLM API, and saves the results to a JSON file.
    """
    if not os.path.exists(input_file):
        print(f"❌ ERROR: Required input file '{input_file}' not found.")
        print("Please ensure your 'comments_data.csv' file is in the current directory.")
        return

    print(f"Reading data from {input_file}...")

    # 1. Read the CSV file
    comments_to_analyze = []
    try:
        # 'r' mode for reading, 'utf-8' encoding handles Arabic characters
        with open(input_file, mode='r', encoding='utf-8') as file:
            # Assumes the CSV columns are 'id' and 'comment'
            reader = csv.DictReader(file)
            for row in reader:
                # Basic data cleanup
                comment_text = row.get('comment', '').strip()
                post_id = row.get('id', '').strip()

                if post_id and comment_text:
                    # Replace double quotes within the comment to prevent JSON structure errors
                    clean_comment = comment_text.replace('"', "'")
                    comments_to_analyze.append({
                        "id": post_id,
                        "comment": clean_comment
                    })

    except Exception as e:
        print(f"❌ An error occurred while reading the CSV: {e}")
        return

    print(f"✅ Found {len(comments_to_analyze)} comments to analyze.")

    analyzed_results = []

    # 2. Iterate and call the LLM API
    for i, data in enumerate(comments_to_analyze):
        post_id = data['id']
        comment_text = data['comment']

        print(f"\n[{i + 1}/{len(comments_to_analyze)}] 🧠 Analyzing ID: {post_id}...")

        # Customize the prompt for the current comment
        user_content = ANALYSIS_PROMPT.replace("{{id_placeholder}}", post_id).replace("{{comment_placeholder}}",
                                                                                      comment_text)

        try:
            completion = client.chat.completions.create(
                model="openai/gpt-3.5-turbo-16k",  # Robust model for complex JSON structure
                messages=[
                    {"role": "system",
                     "content": "You are an expert social media analyst. Your task is to provide a comprehensive analysis of a user comment. You MUST output ONLY a single, valid JSON object."},
                    {"role": "user", "content": user_content}
                ],
                # Forces the API to return a JSON object, enhancing reliability
                response_format={"type": "json_object"}
            )

            # 3. Parse and store the result
            response_json_str = completion.choices[0].message.content
            result_data = json.loads(response_json_str)
            analyzed_results.append(result_data)

            # Recommended: Add a short delay to respect API rate limits
            time.sleep(1)

        except json.JSONDecodeError:
            print(f"--- ⚠️ WARNING: Failed to parse JSON for ID {post_id}. Skipping result. ---")
        except Exception as e:
            print(f"--- ❌ ERROR: API call failed for ID {post_id}: {e} ---")
            continue

    # 4. Save all results to the output file
    if analyzed_results:
        with open(output_file, 'w', encoding='utf-8') as f:
            # Saves results in a readable format with indentation
            json.dump(analyzed_results, f, ensure_ascii=False, indent=4)
        print("\n" + "=" * 50)
        print(f"🎉 Analysis Complete! {len(analyzed_results)} comments analyzed and results saved to {output_file}")
        print("=" * 50)
    else:
        print("\nNo successful analyses were saved.")


# --- Execution ---

if __name__ == "__main__":
    # NOTE: The dummy data block is removed. The script now strictly attempts to load comments_data.csv.
    analyze_comments(INPUT_FILE, OUTPUT_FILE)