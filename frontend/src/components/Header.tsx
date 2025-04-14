import "../index.css"; 

export default function Header() {
  return (
    <header className="chat_header">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="font-bold text-2xl mb-3 sm:mb-0">Chat Application</h1>
        
        <nav>
          <ul className="flex space-x-6">
            <li><a href="/login" className="hover:text-white transition-colors">Login</a></li>
            <li><a href="/register" className="hover:text-white transition-colors">Register</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}