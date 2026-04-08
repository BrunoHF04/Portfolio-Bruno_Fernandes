import os

path = r'd:\Antigravity\Portfolio-Bruno_Fernandes\style.css'
if not os.path.exists(path):
    print(f"File not found: {path}")
    exit(1)

content = open(path, 'r', encoding='utf-8').read()

# 1. Update variables
# Dark mode
content = content.replace('--nav-bg: rgba(10, 10, 12, 0.95);', '--nav-bg: rgba(10, 10, 12, 0.7);')
# Light mode
content = content.replace('--nav-bg: rgba(255, 255, 255, 0.95);', '--nav-bg: rgba(255, 255, 255, 0.45);')

# 2. Fix base .main-nav background (make it use the variable from the start)
# Looking for: background: rgba(10, 10, 12, 0.7);
content = content.replace('background: rgba(10, 10, 12, 0.7);', 'background: var(--nav-bg);')

# 3. Fix the hardcoded light mode block if it remains
import re
pattern = r'\[data-theme="light"\] \.main-nav \{[^}]+\}'
replacement = '[data-theme="light"] .main-nav {\n    background: var(--nav-bg);\n    backdrop-filter: blur(15px);\n    -webkit-backdrop-filter: blur(15px);\n    border: 1px solid rgba(255, 255, 255, 0.5);\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);\n}'
content = re.sub(pattern, replacement, content)

# 4. Handle Link Colors (No more purple)
# We add !important and ensure it covers all states
links_fix = '''
[data-theme="light"] .nav-links a { color: #1e293b !important; }
[data-theme="light"] .nav-links a:visited, [data-theme="light"] .nav-links a:active { color: #1e293b !important; }
[data-theme="light"] .nav-links a:hover, [data-theme="light"] .nav-links a.active { color: var(--accent-primary) !important; }
'''
if links_fix not in content:
    content = content.replace('.main-nav {', links_fix + '\n.main-nav {')

# 5. GitHub Card Fix (Theme aware)
github_fix = '''
[data-theme="light"] .github-stats-card {
    background: linear-gradient(135deg, #f1f5f9, #f8fafc);
    border-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}
[data-theme="light"] .stats-label, [data-theme="light"] .stat-name { color: #64748b; }
[data-theme="light"] .stat-value { color: #1e293b; }
'''
if '.github-stats-card {' in content and '[data-theme="light"] .github-stats-card' not in content:
    content = content.replace('overflow: hidden;\n}', 'overflow: hidden;\n}' + github_fix)

open(path, 'w', encoding='utf-8').write(content)
print("CSS Fix applied successfully.")
