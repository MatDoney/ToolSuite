#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Générateur automatisé de documentation technique pour ToolSuite.
Parse les blocs JSDoc 3 et PHPDoc du projet et génère :
1. Un manuel d'API en Markdown (docs/API.md)
2. Une interface web statique interactive et navigable (docs/index.html)
"""

import os
import sys
import re
import html
import json
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = Path(__file__).resolve().parent.parent
JS_DIR = BASE_DIR / "js"
API_DIR = BASE_DIR / "api"
DOCS_DIR = BASE_DIR / "docs"

DOCS_DIR.mkdir(exist_ok=True)

# Fichiers cibles à documenter (exclut vendor)
TARGET_FILES = [
    JS_DIR / "app.js",
    JS_DIR / "ui.js",
    JS_DIR / "tools" / "pdf-advanced-tools.js",
    JS_DIR / "tools" / "pdf-tools.js",
    JS_DIR / "tools" / "ocr-tool.js",
    JS_DIR / "tools" / "markdown-tool.js",
    JS_DIR / "tools" / "bg-remover.js",
    JS_DIR / "tools" / "image-tools.js",
    JS_DIR / "tools" / "wheel-tool.js",
    JS_DIR / "tools" / "finance-tools.js",
    JS_DIR / "tools" / "marketing-tools.js",
    JS_DIR / "tools" / "productivity-tools.js",
    JS_DIR / "tools" / "text-tools.js",
    JS_DIR / "tools" / "utility-tools.js",
    JS_DIR / "tools" / "dev-tools.js",
    API_DIR / "api.php",
]

def parse_docblock(raw_comment):
    """Extrait les tags et la description d'un bloc de commentaire JSDoc/PHPDoc."""
    lines = raw_comment.strip().splitlines()
    cleaned_lines = []
    for line in lines:
        l = line.strip()
        if l.startswith("/**"):
            l = l[3:].strip()
        if l.endswith("*/"):
            l = l[:-2].strip()
        if l.startswith("*"):
            l = l[1:].strip()
        cleaned_lines.append(l)

    text = "\n".join(cleaned_lines).strip()
    
    # Séparation description principale vs tags
    parts = re.split(r'\n(?=@\w+)', text)
    description = ""
    tags = []
    
    if parts and not parts[0].strip().startswith("@"):
        description = parts[0].strip()
        tag_parts = parts[1:]
    else:
        tag_parts = parts

    for part in tag_parts:
        part = part.strip()
        if not part.startswith("@"):
            continue
        m = re.match(r'^@(\w+)(?:\s+(.*))?$', part, re.DOTALL)
        if m:
            tag_name = m.group(1)
            tag_content = (m.group(2) or "").strip()
            tags.append({"name": tag_name, "content": tag_content})

    return {"description": description, "tags": tags}

def extract_file_docs(filepath):
    """Parse un fichier source et en extrait la structure documentaire."""
    try:
        content = filepath.read_text(encoding="utf-8")
    except Exception as e:
        print(f"Erreur lecture {filepath}: {e}")
        return None

    # Extraction de tous les blocs /** ... */
    pattern = re.compile(r'/\*\*[\s\S]*?\*/', re.MULTILINE)
    blocks = pattern.findall(content)

    file_doc = {
        "file": str(filepath.relative_to(BASE_DIR)).replace("\\", "/"),
        "title": filepath.name,
        "description": "",
        "module": "",
        "namespace": "",
        "typedefs": [],
        "functions": [],
        "constants": [],
        "classes": [],
        "all_items": []
    }

    for block in blocks:
        parsed = parse_docblock(block)
        tags = parsed["tags"]
        tag_dict = {t["name"]: t["content"] for t in tags}

        # En-tête de fichier
        if "file" in tag_dict or "fileoverview" in tag_dict:
            file_doc["description"] = parsed["description"]
            file_doc["title"] = tag_dict.get("file") or tag_dict.get("fileoverview") or filepath.name
            if "module" in tag_dict:
                file_doc["module"] = tag_dict["module"]
            continue

        # Namespace
        if "namespace" in tag_dict:
            ns_name = tag_dict["namespace"]
            file_doc["namespace"] = ns_name
            file_doc["all_items"].append({
                "type": "namespace",
                "name": ns_name,
                "description": parsed["description"],
                "tags": tags
            })
            continue

        # Typedef
        if "typedef" in tag_dict:
            td_match = re.match(r'\{([^}]+)\}\s*([^\s]+)', tag_dict["typedef"])
            td_type = td_match.group(1) if td_match else ""
            td_name = td_match.group(2) if td_match else tag_dict["typedef"]
            
            # Récupération des propriétés
            props = []
            for t in tags:
                if t["name"] == "property":
                    prop_m = re.match(r'\{([^}]+)\}\s*([^\s]+)(?:\s+(.*))?', t["content"], re.DOTALL)
                    if prop_m:
                        props.append({
                            "type": prop_m.group(1),
                            "name": prop_m.group(2),
                            "desc": prop_m.group(3) or ""
                        })
                    else:
                        props.append({"type": "", "name": t["content"], "desc": ""})

            item = {
                "type": "typedef",
                "name": td_name,
                "dataType": td_type,
                "description": parsed["description"],
                "properties": props
            }
            file_doc["typedefs"].append(item)
            file_doc["all_items"].append(item)
            continue

        # Function / Method / PHP Endpoint
        is_fn = "function" in tag_dict or any(t["name"] in ("param", "returns", "return") for t in tags)
        
        # Détection spécifique aux endpoints PHP dans switch ($action)
        idx = content.find(block)
        sub = ""
        if idx != -1:
            sub = content[idx + len(block):idx + len(block) + 180].strip()

        case_m = re.search(r"case\s+['\"]([^'\"]+)['\"]\s*:", sub)
        if case_m:
            is_fn = True
            fn_name = f"Endpoint REST : ?action={case_m.group(1)}"

        if is_fn:
            if not case_m:
                fn_name = tag_dict.get("function", "")
                if not fn_name and idx != -1:
                    m_fn = re.search(r'(?:(?:const|let|var|async|function)\s+)?([a-zA-Z0-9_$]+)\s*(?:=\s*(?:async\s*)?(?:function|\([^)]*\)\s*=>)|:|\()', sub)
                    if m_fn:
                        fn_name = m_fn.group(1)
            
            params = []
            returns = []
            throws = []
            examples = []

            for t in tags:
                if t["name"] == "param":
                    pm = re.match(r'\{([^}]+)\}\s*([^\s]+)(?:\s+(.*))?', t["content"], re.DOTALL)
                    if pm:
                        p_type = pm.group(1)
                        p_name = pm.group(2)
                        p_desc = pm.group(3) or ""
                        is_opt = p_name.startswith("[") and p_name.endswith("]")
                        params.append({
                            "type": p_type,
                            "name": p_name,
                            "desc": p_desc,
                            "optional": is_opt
                        })
                    else:
                        params.append({"type": "", "name": t["content"], "desc": "", "optional": False})
                elif t["name"] in ("returns", "return"):
                    rm = re.match(r'\{([^}]+)\}(?:\s+(.*))?', t["content"], re.DOTALL)
                    if rm:
                        returns.append({"type": rm.group(1), "desc": rm.group(2) or ""})
                    else:
                        returns.append({"type": "", "desc": t["content"]})
                elif t["name"] == "throws":
                    tm = re.match(r'\{([^}]+)\}(?:\s+(.*))?', t["content"], re.DOTALL)
                    if tm:
                        throws.append({"type": tm.group(1), "desc": tm.group(2) or ""})
                    else:
                        throws.append({"type": "", "desc": t["content"]})
                elif t["name"] == "example":
                    examples.append(t["content"])

            item = {
                "type": "function",
                "name": fn_name or "Fonction anonyme / interne",
                "description": parsed["description"],
                "params": params,
                "returns": returns,
                "throws": throws,
                "examples": examples
            }
            file_doc["functions"].append(item)
            file_doc["all_items"].append(item)
            continue

        # Autre type (ex: @constant, @class)
        if "constant" in tag_dict or "const" in tag_dict:
            c_name = tag_dict.get("constant") or tag_dict.get("const") or ""
            item = {
                "type": "constant",
                "name": c_name,
                "description": parsed["description"]
            }
            file_doc["constants"].append(item)
            file_doc["all_items"].append(item)
        elif parsed["description"]:
            item = {
                "type": "block",
                "name": "Note / Description",
                "description": parsed["description"]
            }
            file_doc["all_items"].append(item)

    return file_doc

def generate_markdown_manual(all_docs):
    """Génère docs/API.md avec un index complet et les signatures détaillées."""
    md = []
    md.append("# ToolSuite — Référence Complète de l'API & Documentation Technique\n")
    md.append("> Généré automatiquement d'après les blocs de spécifications **JSDoc 3** et **PHPDoc** du projet.\n")
    md.append("## Table des Matières\n")
    
    for doc in all_docs:
        anchor = doc["file"].replace("/", "").replace(".", "").replace("-", "").lower()
        title = doc["title"]
        md.append(f"- [{title} (`{doc['file']}`)](#{anchor})")
        if doc["namespace"]:
            md.append(f"  - Namespace: `{doc['namespace']}`")
        if doc["functions"]:
            md.append(f"  - Fonctions : {len(doc['functions'])} documentées")
        if doc["typedefs"]:
            md.append(f"  - Types personnalisés : {len(doc['typedefs'])} typages")

    md.append("\n---\n")

    for doc in all_docs:
        anchor = doc["file"].replace("/", "").replace(".", "").replace("-", "").lower()
        md.append(f"\n## <a id=\"{anchor}\"></a>{doc['title']}\n")
        md.append(f"**Fichier :** [`{doc['file']}`](../{doc['file']})  \n")
        if doc["module"]:
            md.append(f"**Module :** `{doc['module']}`  \n")
        if doc["namespace"]:
            md.append(f"**Espace de noms (Namespace) :** `{doc['namespace']}`  \n")
        
        if doc["description"]:
            md.append(f"\n### Description\n{doc['description']}\n")

        # Typedefs
        if doc["typedefs"]:
            md.append("\n### Définitions de Types (`@typedef`)\n")
            for td in doc["typedefs"]:
                md.append(f"#### `{td['name']}` ({td['dataType']})\n")
                if td["description"]:
                    md.append(f"{td['description']}\n")
                if td["properties"]:
                    md.append("\n| Propriété | Type | Description |")
                    md.append("|---|---|---|")
                    for p in td["properties"]:
                        p_name = p['name'].replace('|', '&#124;')
                        p_type = f"`{p['type']}`" if p['type'] else "-"
                        p_desc = p['desc'].replace('|', '&#124;').strip()
                        md.append(f"| `{p_name}` | {p_type} | {p_desc} |")
                    md.append("\n")

        # Functions
        if doc["functions"]:
            md.append("\n### Fonctions et Méthodes\n")
            for fn in doc["functions"]:
                fn_name = fn['name']
                # Signature
                sig_params = ", ".join([p["name"] for p in fn["params"]])
                md.append(f"#### `{fn_name}({sig_params})`\n")
                if fn["description"]:
                    md.append(f"{fn['description']}\n")

                if fn["params"]:
                    md.append("\n**Paramètres :**\n")
                    md.append("| Paramètre | Type | Statut | Description |")
                    md.append("|---|---|---|---|")
                    for p in fn["params"]:
                        p_type = f"`{p['type']}`" if p['type'] else "-"
                        opt_str = "Optionnel" if p["optional"] else "**Requis**"
                        p_desc = p['desc'].replace('|', '&#124;').strip()
                        md.append(f"| `{p['name']}` | {p_type} | {opt_str} | {p_desc} |")
                    md.append("\n")

                if fn["returns"]:
                    md.append("\n**Valeur de retour :**\n")
                    for r in fn["returns"]:
                        r_type = f"`{r['type']}`" if r['type'] else "-"
                        md.append(f"- {r_type} : {r['desc']}\n")

                if fn["throws"]:
                    md.append("\n**Exceptions levées (`@throws`) :**\n")
                    for th in fn["throws"]:
                        t_type = f"`{th['type']}`" if th['type'] else "Error"
                        md.append(f"- {t_type} : {th['desc']}\n")

                if fn["examples"]:
                    md.append("\n**Exemple :**\n```javascript")
                    for ex in fn["examples"]:
                        md.append(ex)
                    md.append("```\n")

        md.append("\n---\n")

    return "\n".join(md)

def generate_html_portal(all_docs):
    """Génère docs/index.html avec un portail moderne et réactif."""
    docs_json = json.dumps(all_docs, ensure_ascii=False, indent=2)
    
    html_content = f"""<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documentation Technique — ToolSuite API Manual</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {{
      --bg: #090d16;
      --card-bg: rgba(18, 24, 38, 0.7);
      --card-border: rgba(255, 255, 255, 0.08);
      --sidebar-bg: #0d121f;
      --accent: #6366f1;
      --accent-glow: rgba(99, 102, 241, 0.25);
      --accent-hover: #4f46e5;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --code-bg: #0f172a;
      --tag-fn: #38bdf8;
      --tag-type: #a855f7;
      --tag-ns: #10b981;
      --tag-req: #f43f5e;
      --tag-opt: #64748b;
    }}

    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      display: flex;
      height: 100vh;
      overflow: hidden;
      line-height: 1.6;
    }}

    /* SIDEBAR */
    #sidebar {{
      width: 320px;
      min-width: 320px;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--card-border);
      display: flex;
      flex-direction: column;
      height: 100%;
    }}

    .sidebar-header {{
      padding: 24px 20px 16px;
      border-bottom: 1px solid var(--card-border);
    }}

    .logo-badge {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 800;
      font-size: 1.25rem;
      background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }}

    .version-tag {{
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #818cf8;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 9999px;
      margin-left: 8px;
      vertical-align: middle;
      -webkit-text-fill-color: #818cf8;
    }}

    .search-box {{
      margin-top: 14px;
      position: relative;
    }}

    .search-box input {{
      width: 100%;
      background: var(--code-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 9px 12px 9px 34px;
      color: #fff;
      font-size: 0.88rem;
      outline: none;
      transition: all 0.2s;
    }}

    .search-box input:focus {{
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }}

    .search-icon {{
      position: absolute;
      left: 11px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      font-size: 0.85rem;
    }}

    .sidebar-content {{
      flex: 1;
      overflow-y: auto;
      padding: 12px 8px;
    }}

    .nav-section-title {{
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      font-weight: 700;
      padding: 12px 12px 6px;
    }}

    .nav-item {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-radius: 6px;
      color: #cbd5e1;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      margin-bottom: 2px;
    }}

    .nav-item:hover {{
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
    }}

    .nav-item.active {{
      background: var(--accent);
      color: #fff;
      font-weight: 600;
      box-shadow: 0 4px 12px var(--accent-glow);
    }}

    .nav-badge {{
      font-size: 0.7rem;
      padding: 1px 6px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
      font-family: 'JetBrains Mono', monospace;
    }}

    /* MAIN CONTAINER */
    #main {{
      flex: 1;
      height: 100%;
      overflow-y: auto;
      padding: 40px 60px;
      background: radial-gradient(circle at 100% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 40%),
                  radial-gradient(circle at 0% 100%, rgba(168, 85, 247, 0.05) 0%, transparent 40%);
    }}

    .container {{
      max-width: 1040px;
      margin: 0 auto;
    }}

    /* BREADCRUMB & HEADER */
    .top-bar {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--card-border);
    }}

    .file-path-badge {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      color: var(--text-muted);
      background: var(--code-bg);
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid var(--card-border);
    }}

    .module-header {{
      margin-bottom: 36px;
    }}

    .module-title {{
      font-size: 2.2rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
      color: #fff;
    }}

    .module-desc {{
      font-size: 1.05rem;
      color: #94a3b8;
      max-width: 840px;
      line-height: 1.7;
    }}

    .meta-pills {{
      display: flex;
      gap: 10px;
      margin-top: 16px;
      flex-wrap: wrap;
    }}

    .pill {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
    }}

    .pill-ns {{
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
    }}

    .pill-mod {{
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #a5b4fc;
    }}

    /* SECTIONS */
    .doc-section {{
      margin-bottom: 48px;
    }}

    .section-title {{
      font-size: 1.3rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 10px;
    }}

    /* CARDS */
    .api-card {{
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      backdrop-filter: blur(12px);
      transition: border-color 0.2s, box-shadow 0.2s;
    }}

    .api-card:hover {{
      border-color: rgba(99, 102, 241, 0.4);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    }}

    .api-header {{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 10px;
    }}

    .api-name {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.15rem;
      font-weight: 700;
      color: #38bdf8;
    }}

    .api-name.typedef {{
      color: #c084fc;
    }}

    .api-kind {{
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 4px;
      letter-spacing: 0.05em;
    }}

    .kind-fn {{ background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }}
    .kind-td {{ background: rgba(192, 132, 252, 0.15); color: #c084fc; border: 1px solid rgba(192, 132, 252, 0.3); }}

    .api-desc {{
      color: #cbd5e1;
      font-size: 0.95rem;
      margin-bottom: 16px;
    }}

    /* TABLES */
    .param-table {{
      width: 100%;
      border-collapse: collapse;
      margin-top: 14px;
      font-size: 0.88rem;
    }}

    .param-table th {{
      text-align: left;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-muted);
      font-weight: 600;
      border-bottom: 1px solid var(--card-border);
    }}

    .param-table td {{
      padding: 10px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      vertical-align: top;
    }}

    .code-tag {{
      font-family: 'JetBrains Mono', monospace;
      background: rgba(255, 255, 255, 0.08);
      color: #f1f5f9;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.82rem;
    }}

    .type-tag {{
      font-family: 'JetBrains Mono', monospace;
      color: #ec4899;
      background: rgba(236, 72, 153, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.8rem;
    }}

    .badge-opt {{
      font-size: 0.72rem;
      color: #94a3b8;
      border: 1px solid rgba(148, 163, 184, 0.3);
      padding: 1px 6px;
      border-radius: 9999px;
    }}

    .badge-req {{
      font-size: 0.72rem;
      color: #f43f5e;
      border: 1px solid rgba(244, 63, 94, 0.3);
      padding: 1px 6px;
      border-radius: 9999px;
      font-weight: 600;
    }}

    /* RETURNS & THROWS */
    .returns-box {{
      margin-top: 14px;
      padding: 10px 14px;
      background: rgba(16, 185, 129, 0.07);
      border-left: 3px solid #10b981;
      border-radius: 0 6px 6px 0;
      font-size: 0.88rem;
    }}

    .throws-box {{
      margin-top: 10px;
      padding: 10px 14px;
      background: rgba(244, 63, 94, 0.07);
      border-left: 3px solid #f43f5e;
      border-radius: 0 6px 6px 0;
      font-size: 0.88rem;
    }}

    /* CODE BLOCKS */
    .code-preview {{
      background: var(--code-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 14px 16px;
      margin-top: 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      overflow-x: auto;
      color: #e2e8f0;
    }}

    /* EMPTY STATES & RESPONSIVE */
    @media (max-width: 900px) {{
      body {{ flex-direction: column; height: auto; overflow: visible; }}
      #sidebar {{ width: 100%; min-width: 100%; height: auto; }}
      #main {{ padding: 24px; }}
    }}
  </style>
</head>
<body>

  <!-- SIDEBAR NAVIGATION -->
  <aside id="sidebar">
    <div class="sidebar-header">
      <div class="logo-badge">
        <span>ToolSuite API</span>
        <span class="version-tag">JSDoc 3</span>
      </div>
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" id="searchInput" placeholder="Filtrer fonctions, types...">
      </div>
    </div>
    <div class="sidebar-content" id="navList">
      <!-- Rempli dynamiquement -->
    </div>
  </aside>

  <!-- MAIN DOCUMENTATION VIEW -->
  <main id="main">
    <div class="container" id="contentArea">
      <!-- Rempli dynamiquement -->
    </div>
  </main>

  <script>
    const DOCS_DATA = {docs_json};

    let activeDocIndex = 0;

    function renderNav(filter = '') {{
      const nav = document.getElementById('navList');
      nav.innerHTML = '';
      const f = filter.toLowerCase().trim();

      DOCS_DATA.forEach((doc, idx) => {{
        // Si filtre, vérifie titre, fonctions, typedefs
        const matchesDoc = doc.title.toLowerCase().includes(f) || doc.file.toLowerCase().includes(f);
        const matchedFns = doc.functions.filter(fn => fn.name.toLowerCase().includes(f));
        const matchedTds = doc.typedefs.filter(td => td.name.toLowerCase().includes(f));

        if (f && !matchesDoc && matchedFns.length === 0 && matchedTds.length === 0) {{
          return;
        }}

        const item = document.createElement('a');
        item.className = `nav-item ${{idx === activeDocIndex ? 'active' : ''}}`;
        item.innerHTML = `
          <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${{escapeHtml(doc.title)}}</span>
          <span class="nav-badge">${{doc.functions.length + doc.typedefs.length}}</span>
        `;
        item.onclick = (e) => {{
          e.preventDefault();
          activeDocIndex = idx;
          renderNav(filter);
          renderDoc(doc);
        }};
        nav.appendChild(item);
      }});
    }}

    function renderDoc(doc) {{
      const area = document.getElementById('contentArea');
      let html = '';

      // Entête
      html += `
        <div class="top-bar">
          <div class="file-path-badge">${{escapeHtml(doc.file)}}</div>
          <div>
            <a href="../${{doc.file}}" target="_blank" style="color:#818cf8; font-size:0.85rem; text-decoration:none;">📄 Voir le code source ↗</a>
          </div>
        </div>

        <div class="module-header">
          <h1 class="module-title">${{escapeHtml(doc.title)}}</h1>
          <div class="module-desc">${{escapeHtml(doc.description).replace(/\\n/g, '<br>')}}</div>
          <div class="meta-pills">
            ${{doc.module ? `<span class="pill pill-mod">Module: ${{escapeHtml(doc.module)}}</span>` : ''}}
            ${{doc.namespace ? `<span class="pill pill-ns">Namespace: ${{escapeHtml(doc.namespace)}}</span>` : ''}}
            <span class="pill" style="background:rgba(255,255,255,0.06); color:#94a3b8;">${{doc.functions.length}} fonction(s)</span>
            <span class="pill" style="background:rgba(255,255,255,0.06); color:#94a3b8;">${{doc.typedefs.length}} type(s)</span>
          </div>
        </div>
      `;

      // Typedefs
      if (doc.typedefs && doc.typedefs.length > 0) {{
        html += `
          <div class="doc-section">
            <h2 class="section-title">✨ Types & Structures de Données (@typedef)</h2>
        `;
        doc.typedefs.forEach(td => {{
          html += `
            <div class="api-card">
              <div class="api-header">
                <span class="api-name typedef">${{escapeHtml(td.name)}}</span>
                <span class="api-kind kind-td">${{escapeHtml(td.dataType || 'Object')}}</span>
              </div>
              <div class="api-desc">${{escapeHtml(td.description || 'Pas de description supplémentaire.')}}</div>
          `;
          if (td.properties && td.properties.length > 0) {{
            html += `
              <table class="param-table">
                <thead><tr><th>Propriété</th><th>Type</th><th>Description</th></tr></thead>
                <tbody>
            `;
            td.properties.forEach(p => {{
              html += `
                <tr>
                  <td><span class="code-tag">${{escapeHtml(p.name)}}</span></td>
                  <td><span class="type-tag">${{escapeHtml(p.type || '*')}}</span></td>
                  <td>${{escapeHtml(p.desc)}}</td>
                </tr>
              `;
            }});
            html += `</tbody></table>`;
          }}
          html += `</div>`;
        }});
        html += `</div>`;
      }}

      // Fonctions
      if (doc.functions && doc.functions.length > 0) {{
        html += `
          <div class="doc-section">
            <h2 class="section-title">⚡ Méthodes & Fonctions (@function)</h2>
        `;
        doc.functions.forEach(fn => {{
          const sig = fn.params.map(p => p.name).join(', ');
          html += `
            <div class="api-card" id="fn-${{escapeHtml(fn.name)}}">
              <div class="api-header">
                <span class="api-name">${{escapeHtml(fn.name)}}<span style="color:#94a3b8; font-weight:400;">(${{escapeHtml(sig)}})</span></span>
                <span class="api-kind kind-fn">function</span>
              </div>
              <div class="api-desc">${{escapeHtml(fn.description || 'Aucune description disponible.')}}</div>
          `;

          if (fn.params && fn.params.length > 0) {{
            html += `
              <table class="param-table">
                <thead><tr><th>Paramètre</th><th>Type</th><th>Statut</th><th>Description</th></tr></thead>
                <tbody>
            `;
            fn.params.forEach(p => {{
              html += `
                <tr>
                  <td><span class="code-tag">${{escapeHtml(p.name)}}</span></td>
                  <td><span class="type-tag">${{escapeHtml(p.type || '*')}}</span></td>
                  <td>${{p.optional ? '<span class="badge-opt">Optionnel</span>' : '<span class="badge-req">Requis</span>'}}</td>
                  <td>${{escapeHtml(p.desc)}}</td>
                </tr>
              `;
            }});
            html += `</tbody></table>`;
          }}

          if (fn.returns && fn.returns.length > 0) {{
            fn.returns.forEach(r => {{
              html += `
                <div class="returns-box">
                  <strong>Retourne:</strong> <span class="type-tag">${{escapeHtml(r.type || 'void')}}</span> — ${{escapeHtml(r.desc)}}
                </div>
              `;
            }});
          }}

          if (fn.throws && fn.throws.length > 0) {{
            fn.throws.forEach(t => {{
              html += `
                <div class="throws-box">
                  <strong>Lance une exception (@throws):</strong> <span class="type-tag">${{escapeHtml(t.type || 'Error')}}</span> — ${{escapeHtml(t.desc)}}
                </div>
              `;
            }});
          }}

          if (fn.examples && fn.examples.length > 0) {{
            fn.examples.forEach(ex => {{
              html += `
                <div class="code-preview">// Exemple d'appel :<br>${{escapeHtml(ex)}}</div>
              `;
            }});
          }}

          html += `</div>`;
        }});
        html += `</div>`;
      }}

      area.innerHTML = html;
      area.scrollTop = 0;
    }}

    function escapeHtml(str) {{
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }}

    document.getElementById('searchInput').addEventListener('input', (e) => {{
      renderNav(e.target.value);
    }});

    // Init
    renderNav();
    if (DOCS_DATA.length > 0) {{
      renderDoc(DOCS_DATA[0]);
    }}
  </script>
</body>
</html>
"""
    return html_content

def main():
    print(f"[ToolSuite] Extraction de la documentation depuis {len(TARGET_FILES)} fichiers sources...")
    all_docs = []

    for fpath in TARGET_FILES:
        if not fpath.exists():
            print(f"⚠️ Fichier introuvable : {fpath}")
            continue
        parsed = extract_file_docs(fpath)
        if parsed:
            all_docs.append(parsed)
            print(f"  ✓ {parsed['file']} : {len(parsed['functions'])} fns, {len(parsed['typedefs'])} typedefs")

    # Génération API.md
    md_file = DOCS_DIR / "API.md"
    md_content = generate_markdown_manual(all_docs)
    md_file.write_text(md_content, encoding="utf-8")
    print(f"\n[OK] Manuel Markdown généré avec succès -> {md_file} ({len(md_content.splitlines())} lignes)")

    # Génération index.html
    html_file = DOCS_DIR / "index.html"
    html_content = generate_html_portal(all_docs)
    html_file.write_text(html_content, encoding="utf-8")
    print(f"[OK] Portail Web interactif généré avec succès -> {html_file} ({len(html_content)} octets)")

if __name__ == "__main__":
    main()
