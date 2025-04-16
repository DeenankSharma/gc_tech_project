const fs = require("fs");
const path = require("path");

// Your response looks like one big string with \\n — fix that
let rawResponse = "```dockerfile\n# backend/Dockerfile\n\nFROM golang:1.21-alpine AS builder\n\nWORKDIR /app\n\nCOPY backend/go.mod backend/go.sum ./\nRUN go mod download\n\nCOPY backend/cmd/ cmd/\nCOPY backend/internal/ internal/\n\nRUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app ./cmd/main.go\n\nFROM alpine:latest\nWORKDIR /root/\nCOPY --from=builder /app/app .\nEXPOSE 8080\nCMD [\"./app\"]\n```\n\n```dockerfile\n# frontend/Dockerfile\n\nFROM node:18-alpine AS build\n\nWORKDIR /app\n\nCOPY frontend/package.json frontend/package-lock.json* ./\n\nRUN npm install\n\nCOPY frontend/ .\n\nRUN npm run build\n\nFROM nginx:stable-alpine\nCOPY --from=build /app/dist /usr/share/nginx/html\nEXPOSE 80\n```\n\n```yaml\n# docker-compose.yml\n\nversion: '3.8'\n\nservices:\n  backend:\n    build:\n      context: .\n      dockerfile: backend/Dockerfile\n    ports:\n      - \"8080:8080\"\n    networks:\n      - mynetwork\n\n  frontend:\n    build:\n      context: .\n      dockerfile: frontend/Dockerfile\n    ports:\n      - \"3000:80\"\n    depends_on:\n      - backend\n    networks:\n      - mynetwork\n\nnetworks:\n  mynetwork:\n```"

// ✅ Unescape manually
rawResponse = rawResponse.replace(/\\n/g, '\n').replace(/\\"/g, '"');

// Then extract the blocks
const blocks = [...rawResponse.matchAll(/```(?:\w+)?\n# (.*?)\n([\s\S]*?)```/g)];

blocks.forEach(([, filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim());
  console.log(`✅ Written to ${filePath}`);
});
