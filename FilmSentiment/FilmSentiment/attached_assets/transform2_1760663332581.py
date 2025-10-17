import json
import csv

def convert_timeline_json_to_csv(json_file_path, csv_file_path):
    """
    Reads a JSON file from an Instagram user timeline and converts it
    to a CSV file with 'id' and 'comment' columns.

    Args:
        json_file_path (str): The path to the input JSON file.
        csv_file_path (str): The path where the output CSV file will be saved.
    """
    try:
        # Open and load the JSON data from the file
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Open the CSV file in write mode
        with open(csv_file_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)

            # Write the header row
            writer.writerow(['id', 'comment'])

            # Navigate through the JSON structure to find the list of posts ('edges')
            edges = data.get('data', {}).get('xdt_api__v1__feed__user_timeline_graphql_connection', {}).get('edges', [])

            # Check if there's anything to process
            if not edges:
                print("Warning: No posts ('edges') found in the JSON file.")
                return

            # Loop through each post in the list
            for edge in edges:
                node = edge.get('node', {})
                if not node:
                    continue # Skip if the node is empty

                # Extract the post ID
                post_id = node.get('id')

                # Extract the caption text, checking if 'caption' and 'text' exist
                caption_node = node.get('caption')
                comment_text = None
                if caption_node and isinstance(caption_node, dict):
                    comment_text = caption_node.get('text')

                # Write the extracted data as a new row in the CSV
                writer.writerow([post_id, comment_text])

        print(f"✅ Successfully converted '{json_file_path}' to '{csv_file_path}'")

    except FileNotFoundError:
        print(f"❌ Error: The file '{json_file_path}' was not found.")
    except json.JSONDecodeError:
        print(f"❌ Error: The file '{json_file_path}' is not a valid JSON file.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


# --- HOW TO USE ---
if __name__ == "__main__":
    # 1. Name of your input JSON file.
    #    Make sure it's in the same folder as this script.
    input_filename = 'input2.json'

    # 2. Desired name for your output CSV file.
    output_filename = 'post1.csv'

    # 3. Run the conversion.
    convert_timeline_json_to_csv(input_filename, output_filename)