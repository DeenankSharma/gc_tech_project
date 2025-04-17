export const format_cricket_live_scores = (data: any): string => {
    return data.map((match: any) => {
      const tournament = match.tournament.name;
      const teams = `${match.teams.team1.name} vs ${match.teams.team2.name}`;
      const status = match.status;
      const score1 = match.teams.team1.score !== null ? `Score: ${match.teams.team1.score}` : 'Score: N/A';
      const score2 = match.teams.team2.score !== null ? `Score: ${match.teams.team2.score}` : 'Score: N/A';
      
      return `${tournament} - ${teams} - Status: ${status} - ${score1} - ${score2}`;
    }).join('\n').replace(/{}/g, '').replace(/"/g, '');
  };
  