import re

def parse_cricket_matches(data_array):
    # Initialize the results array
    matches = []
    
    for match_data in data_array:
        # Remove extra spaces
        match_data = ' '.join(match_data.split())
        
        # Extract match number, tournament and format
        match_info_pattern = r'(\d+)(?:st|nd|rd|th) Match • (.*?) (T20)'
        match_info = re.search(match_info_pattern, match_data)
        
        if not match_info:
            continue
            
        match_number = int(match_info.group(1))
        tournament_name = match_info.group(2)
        format_type = match_info.group(3)
        
        # Determine tournament short name
        if "Indian Premier League" in tournament_name:
            short_name = "IPL 2025"
        elif "Pakistan Super League" in tournament_name:
            short_name = "PSL 2025"
        else:
            short_name = tournament_name
        
        # Create tournament info
        tournament_info = {
            "name": tournament_name,
            "shortName": short_name,
            "format": format_type
        }
        
        # Extract team and score information
        score_pattern = r'([A-Z]+)(\d+)(?:-(\d+))? \((\d+\.\d+|\d+)\)'
        score_matches = list(re.finditer(score_pattern, match_data))
        
        # Check if match is completed or upcoming
        if len(score_matches) >= 2:
            # Initially set status as ongoing
            status = "ongoing"
            
            # Team 1 info
            team1_short = score_matches[0].group(1)
            team1_score = int(score_matches[0].group(2))
            team1_wickets = int(score_matches[0].group(3)) if score_matches[0].group(3) else None
            team1_overs = float(score_matches[0].group(4))
            
            # Team 2 info
            team2_short = score_matches[1].group(1)
            team2_score = int(score_matches[1].group(2))
            team2_wickets = int(score_matches[1].group(3)) if score_matches[1].group(3) else None
            team2_overs = float(score_matches[1].group(4))
            
            # Check if result is explicitly mentioned - this is the most reliable sign of completion
            result_pattern = r'([A-Za-z ]+) won by ([0-9]+ (?:runs|wkts))'
            result_match = re.search(result_pattern, match_data)
            
            if result_match:
                status = "completed"
                winner_name = result_match.group(1)
                margin = result_match.group(2)
                winning_method = "runs" if "runs" in margin else "wickets"
            else:
                # No explicit result, determine status based on cricket rules
                
                # Case 1: Team 2 has successfully chased the target
                if team2_score > team1_score:
                    status = "completed"
                    winner_name = get_full_team_name(team2_short)
                    margin = f"{10 - team2_wickets if team2_wickets is not None else 'unknown'} wkts"
                    winning_method = "wickets"
                
                # Case 2: Team 2 has played full 20 overs but couldn't reach the target
                elif team2_overs >= 20.0:
                    status = "completed"
                    winner_name = get_full_team_name(team1_short)
                    margin = f"{team1_score - team2_score} runs"
                    winning_method = "runs"
                
                # Case 3: Team 2 has lost all wickets
                elif team2_wickets == 10:
                    status = "completed"
                    winner_name = get_full_team_name(team1_short)
                    margin = f"{team1_score - team2_score} runs"
                    winning_method = "runs"
                
                # If none of the above, the match is still ongoing
                else:
                    status = "ongoing"
                    winner_name = "TBD"
                    margin = "TBD"
                    winning_method = "TBD"
            
            # Determine full team names
            if status == "completed" and result_match:
                if winner_name in match_data.split(str(match_number)):
                    team1_name = winner_name
                    # Try to extract team2 name from the match data
                    remaining_text = match_data.replace(team1_name, "", 1)
                    team2_name = extract_team_name(remaining_text, team2_short)
                else:
                    team2_name = winner_name
                    # Try to extract team1 name from the match data
                    remaining_text = match_data.replace(team2_name, "", 1)
                    team1_name = extract_team_name(remaining_text, team1_short)
            else:
                # If we can't extract result, use placeholders
                team1_name = get_full_team_name(team1_short)
                team2_name = get_full_team_name(team2_short)
                
                if status != "completed":
                    winner_name = "TBD"
                    margin = "TBD"
                    winning_method = "TBD"
            
            # Extract links
            links = re.findall(r'fantasy|table|schedule|points table', match_data.lower())
            
            # Create the match object
            match_obj = {
                "matchNumber": match_number,
                "tournament": tournament_info,
                "status": status,
                "teams": {
                    "team1": {
                        "name": team1_name,
                        "shortName": team1_short,
                        "score": team1_score,
                        "wickets": team1_wickets,
                        "overs": team1_overs
                    },
                    "team2": {
                        "name": team2_name,
                        "shortName": team2_short,
                        "score": team2_score,
                        "wickets": team2_wickets,
                        "overs": team2_overs
                    }
                },
                "result": {
                    "winner": winner_name,
                    "margin": margin,
                    "winningMethod": winning_method
                } if status == "completed" else None,
                "links": links
            }
        else:
            # This is an upcoming match
            status = "upcoming"
            
            # Extract team names for upcoming matches
            parts = match_data.split('•')[1].strip()
            team_parts = parts.split()
            
            # Remove format and match number
            clean_parts = [p for p in team_parts if p.strip() and not re.match(r'T20|fantasy|table|schedule|points', p.lower())]
            
            # Extract team names - they're usually the last distinct words before links section
            if len(clean_parts) >= 2:
                team1_name = clean_parts[0]
                team2_name = clean_parts[1]
                
                # Handle multi-word team names
                for i in range(2, len(clean_parts)):
                    if clean_parts[i] in ["fantasy", "table", "schedule", "points"]:
                        break
                    if i % 2 == 0:  # Even indices belong to team2
                        team2_name += " " + clean_parts[i]
                    else:  # Odd indices belong to team1
                        team1_name += " " + clean_parts[i]
            else:
                team1_name = "Unknown Team 1"
                team2_name = "Unknown Team 2"
            
            # Extract links
            links = re.findall(r'fantasy|table|schedule|points table', match_data.lower())
            
            # Create the match object for upcoming matches
            match_obj = {
                "matchNumber": match_number,
                "tournament": tournament_info,
                "status": status,
                "teams": {
                    "team1": {
                        "name": team1_name,
                        "shortName": get_short_name(team1_name),
                        "score": None,
                        "wickets": None,
                        "overs": None
                    },
                    "team2": {
                        "name": team2_name,
                        "shortName": get_short_name(team2_name),
                        "score": None,
                        "wickets": None,
                        "overs": None
                    }
                },
                "result": None,
                "links": links
            }
        
        # Add match to results array
        matches.append(match_obj)
    
    return matches

def extract_team_name(text, short_name):
    """Try to extract full team name from text based on short name"""
    if short_name == "PBKS":
        return "Punjab Kings"
    elif short_name == "KKR":
        return "Kolkata Knight Riders"
    elif short_name == "LSG":
        return "Lucknow Super Giants"
    elif short_name == "CSK":
        return "Chennai Super Kings"
    elif short_name == "LHQ":
        return "Lahore Qalandars"
    elif short_name == "KRK":
        return "Karachi Kings"
    elif short_name == "ISU":
        return "Islamabad United"
    elif short_name == "PSZ":
        return "Peshawar Zalmi"
    elif short_name == "DC":
        return "Delhi Capitals"
    elif short_name == "RR":
        return "Rajasthan Royals"
    elif short_name == "MS":
        return "Multan Sultans"
    elif short_name == "MI":
        return "Mumbai Indians"
    elif short_name == "RCB":
        return "Royal Challengers Bangalore"
    elif short_name == "SRH":
        return "Sunrisers Hyderabad"
    elif short_name == "GT":
        return "Gujarat Titans"
    elif short_name == "QG":
        return "Quetta Gladiators"
    return f"Unknown Team ({short_name})"

def get_full_team_name(short_name):
    """Return full team name from short name"""
    return extract_team_name("", short_name)

def get_short_name(full_name):
    """Generate short name from full name"""
    team_mapping = {
        # IPL Teams
        "Punjab Kings": "PBKS",
        "Kolkata Knight Riders": "KKR",
        "Lucknow Super Giants": "LSG",
        "Chennai Super Kings": "CSK",
        "Delhi Capitals": "DC",
        "Rajasthan Royals": "RR",   
        "Mumbai Indians": "MI",
        "Royal Challengers Bangalore": "RCB",
        "Sunrisers Hyderabad": "SRH",
        "Gujarat Titans": "GT",

        # PSL Teams
        "Lahore Qalandars": "LHQ",
        "Karachi Kings": "KRK",
        "Islamabad United": "ISU",
        "Peshawar Zalmi": "PSZ",
        "Multan Sultans": "MS",
        "Quetta Gladiators": "QG"
    }
    
    return team_mapping.get(full_name, ''.join(word[0] for word in full_name.split()))