
def check_braces(filename):
    stack = []
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for i, line in enumerate(lines):
        for j, char in enumerate(line):
            if char in '({[':
                stack.append((char, i + 1, j + 1))
            elif char in ')}]':
                if not stack:
                    print(f"Error: Unmatched closing '{char}' at line {i + 1}, col {j + 1}")
                    return
                
                last_open, last_line, last_col = stack.pop()
                expected_close = {'(': ')', '{': '}', '[': ']'}[last_open]
                
                if char != expected_close:
                    print(f"Error: Mismatched closing '{char}' at line {i + 1}, col {j + 1}. Expected '{expected_close}' for '{last_open}' at line {last_line}, col {last_col}")
                    return

    if stack:
        last_open, last_line, last_col = stack[-1]
        print(f"Error: Unmatched opening '{last_open}' at line {last_line}, col {last_col}")

check_braces('c:/Github_repos/jimboy3100.github.io/ogario/ogario-subfiles/render-pixiTest.js')
