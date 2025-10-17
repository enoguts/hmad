import json
import os
from openai import OpenAI

# --- Configuration ---
KPI_INPUT_FILE = "overall_kpi.json"  # Input file containing the aggregated KPI results
TEXT_OUTPUT_FILE = "executive_summary.txt"  # NEW: Output file for the conclusion

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    # IMPORTANT: Use your actual API key here
    api_key="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",
)

# --- LLM Summarization Prompt ---

SUMMARIZATION_PROMPT = """
Analyze the following JSON data which represents the aggregated Key Performance Indicators (KPIs) from social media post comments.

Generate a comprehensive conclusion structured into two labeled parts:

Part 1: A concise, 3-line executive summary of the overall audience sentiment, engagement, and key content focus for these posts.
Part 2: Three (3) concrete suggestions for improving future audience engagement, directly based on the "Top Themes" and "Viewer Curiosity Volume" metrics.

KPI Data:
{}
"""


def generate_conclusion_from_kpis(kpi_data_str):
    """
    Calls the LLM to generate a conclusion and engagement suggestions based on the KPI data.
    """
    print("🧠 Requesting conclusion and suggestions from LLM...")

    user_content = SUMMARIZATION_PROMPT.format(kpi_data_str)

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-3.5-turbo",
            messages=[
                {"role": "system",
                 "content": "You are a senior analyst providing an executive report. Present your output clearly in two labeled sections (Summary and Suggestions)."},
                {"role": "user", "content": user_content}
            ]
        )
        return completion.choices[0].message.content

    except Exception as e:
        return f"❌ ERROR during LLM summarization: {e}"


# --- Main Execution ---

if __name__ == "__main__":

    # --- DUMMY KPI CREATION (for testing if overall_kpi.json is missing) ---
    if not os.path.exists(KPI_INPUT_FILE):
        dummy_kpi = {
            "Total Comments Analyzed": 8,
            "Sentiment Analysis": {
                "Overall_Positive_Rate": "62.50%",
                "Tone_Distribution": {"Neutral": "25.00%", "Positive": "62.50%", "Mixed": "12.50%"},
                "Positive_Count": 5, "Negative_Count": 0, "Neutral_Count": 2, "Mixed_Count": 1
            },
            "Top Themes & Topics": [
                ["Movie inquiry", 1], ["Social dynamics", 1], ["Work-life balance", 1],
                ["Sarah Dahan", 1], ["movie role", 1]
            ],
            "Character_Focus_Rate": "25.00%",
            "Viewer_Curiosity_Volume": 5,
            "Feedback_Type_Distribution": [["Engagement", 4], ["Summary", 2], ["Questioning", 1], ["Neutral", 1]],
            "Total_Actionable_Insights": 12
        }
        with open(KPI_INPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(dummy_kpi, f, indent=4)
        print(f"Created '{KPI_INPUT_FILE}' with dummy data for testing.")

    # 1. Load the KPI JSON data
    if not os.path.exists(KPI_INPUT_FILE):
        print(f"❌ Cannot find '{KPI_INPUT_FILE}'. Please run the KPI calculation script first.")
    else:
        try:
            with open(KPI_INPUT_FILE, 'r', encoding='utf-8') as f:
                kpi_data = json.load(f)

            kpi_data_string = json.dumps(kpi_data, indent=4, ensure_ascii=False)

            # 2. Generate the conclusion
            conclusion = generate_conclusion_from_kpis(kpi_data_string)

            # 3. Save the result to a text file
            with open(TEXT_OUTPUT_FILE, 'w', encoding='utf-8') as f:
                f.write(conclusion)

            # 4. Print confirmation and the result
            print("\n" + "=" * 60)
            print(f"🎉 Conclusion successfully saved to: {TEXT_OUTPUT_FILE}")
            print("=" * 60)
            print("\n--- Summary Content ---")
            print(conclusion)
            print("-----------------------\n")


        except json.JSONDecodeError:
            print(f"❌ ERROR: Failed to parse JSON from '{KPI_INPUT_FILE}'.")
        except Exception as e:
            print(f"❌ An unexpected error occurred: {e}")