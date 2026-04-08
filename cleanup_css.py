import os
import re

path = r'd:\Antigravity\Portfolio-Bruno_Fernandes\style.css'
if not os.path.exists(path):
    print(f"File not found: {path}")
    exit(1)

content = open(path, 'r', encoding='utf-8').read()

# 1. Clean up duplicated blocks between "/* Main Navigation */" and "/* Scroll Progress Bar */"
start_marker = "/* Main Navigation */"
end_marker = "/* Scroll Progress Bar */"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_nav_section = """/* Main Navigation */
.nav-links a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 600;
    transition: var(--transition-smooth);
}
.nav-links a:visited, .nav-links a:active { color: var(--text-secondary); }
.nav-links a:hover { color: var(--accent-primary); }

[data-theme="light"] .nav-links a { color: #1e293b !important; }
[data-theme="light"] .nav-links a:visited, [data-theme="light"] .nav-links a:active { color: #1e293b !important; }
[data-theme="light"] .nav-links a:hover, [data-theme="light"] .nav-links a.active { color: var(--accent-primary) !important; }

.main-nav {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 95%;
    max-width: 1000px;
    z-index: 1000;
    padding: 10px 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100px;
    background: var(--nav-bg);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid var(--border-card);
    transition: var(--transition-smooth);
}

[data-theme="light"] .main-nav {
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}

"""
    content = content[:start_idx] + new_nav_section + content[end_idx:]

open(path, 'w', encoding='utf-8').write(content)
print("CSS Cleaned up and fixed.")
