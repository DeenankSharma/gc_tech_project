import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Trophy, TrendingUp, TrendingDown } from "lucide-react"

// Team data with logos and full names
const teams = [
  {
    id: "DC",
    name: "Delhi Capitals",
    logo: "/placeholder.svg?height=40&width=40",
    matches: 6,
    wins: 5,
    losses: 1,
    nrr: "+0.744",
    points: 10,
    form: ["W", "W", "L", "W", "W"],
  },
  {
    id: "GT",
    name: "Gujarat Titans",
    logo: "/placeholder.svg?height=40&width=40",
    matches: 6,
    wins: 4,
    losses: 2,
    nrr: "+1.081",
    points: 8,
    form: ["W", "W", "L", "W", "L"],
  },
  {
    id: "RCB",
    name: "Royal Challengers Bangalore",
    logo: "/placeholder.svg?height=40&width=40",
    matches: 6,
    wins: 4,
    losses: 2,
    nrr: "+0.672",
    points: 8,
    form: ["W", "L", "W", "W", "L"],
  },
  {
    id: "PBKS",
    name: "Punjab Kings",
    logo: "/placeholder.svg?height=40&width=40",
    matches: 6,
    wins: 4,
    losses: 2,
    nrr: "+0.172",
    points: 8,
    form: ["W", "L", "W", "L", "W"],
  },
  {
    id: "LSG",
    name: "Lucknow Super Giants",
    logo: "/placeholder.svg?height=40&width=40",
    matches: 7,
    wins: 4,
    losses: 3,
    nrr: "+0.086",
    points: 8,
    form: ["W", "L", "W", "L", "W"],
  },
  {
    id: "KKR",
    name: "Kolkata Knight Riders",
    logo: "/placeholder.svg?height=40&width=40",
    matches: 7,
    wins: 3,
    losses: 4,
    nrr: "+0.547",
    points: 6,
    form: ["L", "W", "L", "W", "L"],
  },
  {
    id: "MI",
    name: "Mumbai Indians",
    logo: "/placeholder.svg?height=40&width=40",
    matches: 7,
    wins: 3,
    losses: 4,
    nrr: "+0.239",
    points: 6,
    form: ["L", "W", "L", "W", "L"],
  },
  {
    id: "RR",
    name: "Rajasthan Royals",
    logo: "/placeholder.svg?height=40&width=40",
    matches: 7,
    wins: 2,
    losses: 5,
    nrr: "-0.714",
    points: 4,
    form: ["L", "L", "W", "L", "L"],
  },
  {
    id: "SRH",
    name: "Sunrisers Hyderabad",
    logo: "/placeholder.svg?height=40&width=40",
    matches: 7,
    wins: 2,
    losses: 5,
    nrr: "-1.217",
    points: 4,
    form: ["L", "L", "W", "L", "L"],
  },
  {
    id: "CSK",
    name: "Chennai Super Kings",
    logo: "/placeholder.svg?height=40&width=40",
    matches: 7,
    wins: 2,
    losses: 5,
    nrr: "-1.276",
    points: 4,
    form: ["L", "L", "W", "L", "L"],
  },
]

export default function CricketStandings() {
  const [sortColumn, setSortColumn] = useState("points")
  const [sortDirection, setSortDirection] = useState("desc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const sortedTeams = [...teams].sort((a, b) => {
    if (sortColumn === "name") {
      return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    }

    // For numeric columns
    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    // For NRR (string but needs to be compared as number)
    if (sortColumn === "nrr") {
      return sortDirection === "asc"
        ? Number.parseFloat(a.nrr) - Number.parseFloat(b.nrr)
        : Number.parseFloat(b.nrr) - Number.parseFloat(a.nrr)
    }

    return 0
  })

  // Function to determine row background based on position
  const getRowBackground = (index: number) => {
    if (index < 4) return "bg-purple-50 dark:bg-purple-950/20" // Playoff positions
    return ""
  }

  // Function to render NRR with trend icon
  const renderNRR = (nrr: string) => {
    const value = Number.parseFloat(nrr)
    if (value > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <TrendingUp className="h-3 w-3" />
          {nrr}
        </div>
      )
    } else if (value < 0) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <TrendingDown className="h-3 w-3" />
          {nrr}
        </div>
      )
    }
    return nrr
  }

  // Function to render form guide
  const renderForm = (form: string[]) => {
    return (
      <div className="flex gap-1 items-center">
        {form.map((result, index) => (
          <Badge
            key={index}
            variant={result === "W" ? "default" : "outline"}
            className={result === "W" ? "bg-purple-600 hover:bg-purple-700" : "border-purple-200 text-purple-700"}
          >
            {result}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <Card className="border-purple-200 shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-900 text-white">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Cricket League Standings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-purple-100 dark:bg-purple-900/30">
              <TableRow>
                <TableHead className="w-12 text-center">Pos</TableHead>
                <TableHead className="min-w-[200px]">Team</TableHead>
                <TableHead
                  className="text-center cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800/30"
                  onClick={() => handleSort("matches")}
                >
                  M
                </TableHead>
                <TableHead
                  className="text-center cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800/30"
                  onClick={() => handleSort("wins")}
                >
                  W
                </TableHead>
                <TableHead
                  className="text-center cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800/30"
                  onClick={() => handleSort("losses")}
                >
                  L
                </TableHead>
                <TableHead
                  className="text-center cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800/30"
                  onClick={() => handleSort("nrr")}
                >
                  NRR
                </TableHead>
                <TableHead
                  className="text-center cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800/30"
                  onClick={() => handleSort("points")}
                >
                  Pts
                </TableHead>
                <TableHead className="hidden md:table-cell">Form</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTeams.map((team, index) => (
                <TableRow
                  key={team.id}
                  className={`${getRowBackground(index)} hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors`}
                >
                  <TableCell className="text-center font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center">
                        <img
                          src={team.logo || "/placeholder.svg"}
                          alt={`${team.name} logo`}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{team.name}</div>
                        <div className="text-xs text-muted-foreground">{team.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{team.matches}</TableCell>
                  <TableCell className="text-center font-medium text-green-600">{team.wins}</TableCell>
                  <TableCell className="text-center font-medium text-red-600">{team.losses}</TableCell>
                  <TableCell className="text-center">{renderNRR(team.nrr)}</TableCell>
                  <TableCell className="text-center font-bold text-purple-700">{team.points}</TableCell>
                  <TableCell className="hidden md:table-cell">{renderForm(team.form)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
