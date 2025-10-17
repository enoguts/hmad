import json
from collections import Counter
import os

# --- Configuration ---
JSON_FILE = "analyzed_comments.json"
# NEW: Output file for the aggregated KPI report
KPI_OUTPUT_FILE = "overall_kpi.json"


# --- Aggregation and KPI Calculation Function ---

def calculate_kpis(data):
    """
    Calculates aggregated KPIs from the list of analyzed comments.
    """
    total_comments = len(data)

    # Initialize containers for metrics
    sentiment_counts = Counter()
    theme_counts = Counter()
    total_questions = 0
    total_insights = 0
    feedback_types = Counter()

    for item in data:
        # Safety check for required keys
        if 'analysis' not in item or 'sentiment' not in item['analysis']:
            continue

        analysis = item['analysis']

        # 1. Sentiment Breakdown
        sentiment_counts[analysis['sentiment']['overall_tone']] += 1

        # 2. Main Themes & Topics
        for theme in analysis.get('themes_and_topics', []):
            theme_counts[theme] += 1

        # 3. Common Viewer Questions
        total_questions += len(analysis.get('viewer_questions', []))

        # 4. Key Feedback Points
        feedback_types[analysis['key_feedback']['type']] += 1

        # 5. Actionable Insights
        total_insights += len(analysis.get('actionable_insights', []))

    # --- Generate KPI Report ---

    # Handle division by zero for percentage calculation if no comments were analyzed
    if total_comments == 0:
        return {"Error": "No comments were analyzed. File might be empty."}

    kpi_report = {
        "Total Comments Analyzed": total_comments,

        # KPI 1: Sentiment Breakdown (Engagement Score)
        "Sentiment Analysis": {
            "Overall_Positive_Rate": f"{(sentiment_counts['Positive'] / total_comments * 100):.2f}%" if sentiment_counts.get(
                'Positive') else "0.00%",
            "Tone_Distribution": {k: f"{(v / total_comments * 100):.2f}%" for k, v in sentiment_counts.items()},
            "Positive_Count": sentiment_counts.get('Positive', 0),
            "Negative_Count": sentiment_counts.get('Negative', 0),
            "Neutral_Count": sentiment_counts.get('Neutral', 0),
            "Mixed_Count": sentiment_counts.get('Mixed', 0),
        },

        # KPI 2: Theme Dominance
        "Top Themes & Topics": theme_counts.most_common(5),  # Show top 5 themes
        "Character_Focus_Rate": f"{(theme_counts.get('Characterization', 0) + theme_counts.get('Character Analysis', 0)) / total_comments * 100:.2f}%",

        # KPI 3: Viewer Curiosity & Feedback
        "Viewer_Curiosity_Volume": total_questions,
        "Feedback_Type_Distribution": feedback_types.most_common(),

        # KPI 4: Actionable Insights Volume
        "Total_Actionable_Insights": total_insights,
    }

    return kpi_report


# --- Main Execution ---

if __name__ == "__main__":

    print(f"Loading detailed analysis data from {JSON_FILE}...")

    # 1. Check if the JSON file exists
    if not os.path.exists(JSON_FILE):
        print(f"❌ ERROR: The file '{JSON_FILE}' was not found in the current directory.")
        print("Please ensure the analyzed data is saved there from the previous step.")
    else:
        try:
            # 2. Read the JSON file
            with open(JSON_FILE, 'r', encoding='utf-8') as f:
                ANALYSIS_DATA = json.load(f)

            # 3. Calculate KPIs
            kpis = calculate_kpis(ANALYSIS_DATA)

            # 4. Save the KPI Report to a new JSON file
            with open(KPI_OUTPUT_FILE, 'w', encoding='utf-8') as f:
                json.dump(kpis, f, indent=4, ensure_ascii=False)

            # 5. Print confirmation and report summary
            print("\n" + "=" * 60)
            print("           📊 AGGREGATED COMMENT ANALYSIS (KPI REPORT) 📊")
            print("=" * 60)
            print(json.dumps(kpis, indent=4, ensure_ascii=False))
            print("\n" + "=" * 60)
            print(f"✅ Full KPI report saved to: {KPI_OUTPUT_FILE}")
            print("=" * 60)

        except json.JSONDecodeError:
            print(f"❌ ERROR: Failed to parse JSON from '{JSON_FILE}'.")
            print("Please ensure the file contains valid JSON data.")
        except Exception as e:
            print(f"❌ An unexpected error occurred: {e}")