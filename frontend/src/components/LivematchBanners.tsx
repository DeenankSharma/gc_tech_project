import { useState, useEffect } from "react"
import { Card } from "../components/ui/card"
// Remove Next.js Image import
import { Sparkles } from "lucide-react"

interface TeamInfo {
  name: string
  logo: string
  score: string
  color?: string
}

interface MatchUpdate {
  text: string
  isImportant?: boolean
}

interface LiveMatchBannerProps {
  teamA?: TeamInfo
  teamB?: TeamInfo
  updates?: MatchUpdate[]
  isLive?: boolean
  refreshInterval?: number
  primaryColor?: string
  secondaryColor?: string
  children?: React.ReactNode // Add children prop to allow nesting components
}

export default function LiveMatchBanner({
  teamA = {
    name: "Team A",
    logo: "/placeholder.svg?height=40&width=40",
    score: "120/3",
    color: "#ff5e5b",
  },
  teamB = {
    name: "Team B",
    logo: "/placeholder.svg?height=40&width=40",
    score: "95/2",
    color: "#5271ff",
  },
  updates = [{ text: "Team B needs 26 runs in 18 balls", isImportant: true }, { text: "Last wicket: Smith (34)" }],
  isLive = true,
  refreshInterval = 10000,
  primaryColor = "#1a2a6c",
  secondaryColor = "#b21f1f",
  children, // Add children prop
}: LiveMatchBannerProps) {
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0)

  useEffect(() => {
    if (updates.length <= 1) return

    const interval = setInterval(() => {
      setCurrentUpdateIndex((prev) => (prev + 1) % updates.length)
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [updates.length, refreshInterval])

  return (
    <>
      <Card className="w-full max-w-md overflow-hidden border-0 rounded-xl shadow-lg">
      <div className="relative bg-gradient-to-r from-[#1a237e] via-[#512da8] to-[#9c27b0] dark:from-[#0d47a1] dark:via-[#4527a0] dark:to-[#7b1fa2]">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>

          {isLive && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-red-600/90 text-white px-3 py-1 rounded-full shadow-md animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="text-xs font-bold tracking-wider">LIVE</span>
            </div>
          )}

          <div className="relative flex items-center justify-between p-5 z-0">
            {/* Team A */}
            <div className="flex flex-col items-center space-y-2 w-1/3">
              <div
                className="relative h-16 w-16 overflow-hidden rounded-full p-1.5 shadow-lg transition-transform duration-300 hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${teamA.color || "#ff5e5b"}, #ffffff)` }}
              >
                <div className="absolute inset-0.5 rounded-full bg-white/90 z-0"></div>
                {/* Replace Next.js Image with standard img */}
                <img
                  src={teamA.logo || "/placeholder.svg"}
                  alt={teamA.name}
                  className="object-contain z-10 p-1.5 w-full h-full"
                />
              </div>
              <span className="text-sm font-bold text-white drop-shadow-md">{teamA.name}</span>
              <span className="text-xl font-extrabold text-white drop-shadow-md">{teamA.score}</span>
            </div>

            {/* Middle section */}
            <div className="flex flex-col items-center justify-center w-1/3 z-10">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-white/10 blur-md"></div>
                <span className="relative text-2xl font-black text-white tracking-widest">VS</span>
              </div>
            </div>

            {/* Team B */}
            <div className="flex flex-col items-center space-y-2 w-1/3">
              <div
                className="relative h-16 w-16 overflow-hidden rounded-full p-1.5 shadow-lg transition-transform duration-300 hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${teamB.color || "#5271ff"}, #ffffff)` }}
              >
                <div className="absolute inset-0.5 rounded-full bg-white/90 z-0"></div>
                {/* Replace Next.js Image with standard img */}
                <img
                  src={teamB.logo || "/placeholder.svg"}
                  alt={teamB.name}
                  className="object-contain z-10 p-1.5 w-full h-full"
                />
              </div>
              <span className="text-sm font-bold text-white drop-shadow-md">{teamB.name}</span>
              <span className="text-xl font-extrabold text-white drop-shadow-md">{teamB.score}</span>
            </div>
          </div>

          {/* Match updates */}
          <div className="relative z-10 bg-white/10 backdrop-blur-md p-3 text-center min-h-[46px] flex items-center justify-center border-t border-white/20">
            <p
              className={`text-sm text-white ${updates[currentUpdateIndex]?.isImportant ? "font-bold" : ""} transition-opacity duration-300`}
              style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.3)" }}
            >
              {updates[currentUpdateIndex]?.isImportant && (
                <Sparkles className="inline-block mr-1 h-4 w-4 text-yellow-300" />
              )}
              {updates[currentUpdateIndex]?.text || "Match in progress"}
            </p>
          </div>
        </div>
      </Card>
      
      {/* Render children if any are passed */}
      {children}
    </>
  )
}