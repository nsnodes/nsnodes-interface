# add-society

Add new societies to the database from a markdown file or interactively.

## Usage

This command helps non-technical users add new societies to the database. You can either:
1. Add societies from a `new-societies.md` file
2. Add a single society interactively

## Process

When you run `/add-society`, Claude will:

1. **Check for new-societies.md file** in the project root
   - If found, parse and add all societies from the file
   - If not found, prompt you for society details

2. **For each society, Claude will:**
   - Validate all required fields (name, URL)
   - Fetch additional information from the website if possible
   - Download and store the logo/icon
   - Add the society to Supabase database

3. **Interactive mode prompts for:**
   - Society name
   - Website URL
   - Type (Physical/Online/Popup/Decentralized)
   - Location (city/country or "Global")
   - Logo URL or local image path
   - Mission statement (optional)
   - Social media links (optional)

## File Format

Create a `new-societies.md` file in the project root with this format:

```markdown
# New Societies to Add

## Society Name 1
- **URL**: https://example.com
- **Type**: Physical/Online/Popup/Decentralized
- **Location**: City, Country (or "Global")
- **Logo**: https://example.com/logo.png (or path to local file)
- **Mission**: Brief description (optional)
- **X/Twitter**: @handle (optional)
- **Discord**: invite-link (optional)

## Society Name 2
- **URL**: https://example2.com
- **Type**: Online
- **Location**: Global
- **Logo**: ./logos/society2.png
...
```

## Examples

### Example 1: Add from file
```
/add-society
```
Claude will look for `new-societies.md` and add all societies listed.

### Example 2: Add interactively
```
/add-society
```
If no file exists, Claude will prompt you for details.

### Example 3: Quick add with basic info
You can also provide basic info directly:
```
/add-society "Network State Name" https://website.com
```

## Tips

1. **Logo files**:
   - Preferred formats: PNG, JPG, SVG
   - Ideal size: 200x200px or larger
   - Can provide URL or local file path

2. **Claude will automatically:**
   - Fetch the website to gather additional information
   - Download and optimize logos
   - Store everything in Supabase

3. **After adding:**
   - The society will appear on the website immediately
   - Icons are automatically stored in Supabase Storage

## Implementation

When this command is run, Claude will:

1. Check if `new-societies.md` exists
2. Parse the markdown file or prompt for input
3. For each society:
   - Validate the data
   - Use WebFetch to get additional info from the website
   - Download the logo if URL provided
   - Store logo in Supabase Storage
   - Insert society record into Supabase
4. Provide a summary of what was added

The command uses the existing Supabase connection and the scripts in the `/scripts` folder.