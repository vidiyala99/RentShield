from datetime import datetime, timedelta

def evaluate_repairs(answers: dict):
    # Logic for Repairs
    # q1: Issue (checkbox)
    # q2: Notified? (radio)
    # q3: Duration (text)
    
    issues = answers.get("q_1", [])
    notified = answers.get("q_2", "No")
    duration = answers.get("q_3", "Unknown duration")
    
    issue_list = ", ".join(issues) if isinstance(issues, list) else str(issues)
    
    context = {
        "issue_details": f"The following issues are present: {issue_list}. This has been occurring for {duration}.",
        "notice_method": "verbal communication" if "verbally" in notified else "prior written notice",
        "deadline_days": "7" if "No Heat" in issue_list else "14" 
    }
    
    return {
        "outcome_summary": "Landlord Obligation Triggered",
        "rights_explanation": "Under NC GS 42-42, landlords must maintain fit and habitable premises. Since you have identified issues like " + issue_list + ", your landlord is legally required to repair them.",
        "template_name": "repairs.txt",
        "context": context
    }

def evaluate_deposit(answers: dict):
    # Logic for Deposit
    # q_4: Time since move out (< 30, > 30) (IDs might vary, assuminig mapping or slug)
    # q_5: Forwarding address?
    
    # In a real app we'd map Question IDs to keys more robustly.
    # For now, let's look for known keys or assume order.
    # Actually, the frontend sends answers keyed by "q_{id}".
    # We need to know which ID corresponds to which question.
    # For this MVP, let's extract by checking values or keys loosely if IDs are stable.
    # IDs were seeded: Repairs(1) -> Q1, Q2, Q3. Deposit(2) -> Q4, Q5 (auto-increment).
    
    time_since = answers.get("q_4", "")
    forwarding_provided = answers.get("q_5", "")
    
    is_over_30 = "More than 30 days" in time_since
    
    context = {
        "move_out_date": (datetime.now() - timedelta(days=35)).strftime("%B %d, %Y") if is_over_30 else "recently",
        "deposit_amount": "[Insert Amount]"
    }
    
    if is_over_30:
        summary = "Violation of 30-Day Rule"
        explanation = "NC landlords must return deposits or an itemized list of deductions within 30 days. Since it has been more than 30 days, you may be entitled to the full return."
    else:
        summary = "Standard Request"
        explanation = "It has been less than 30 days, but you should ensure they have your forwarding address to avoid delays."

    return {
        "outcome_summary": summary,
        "rights_explanation": explanation,
        "template_name": "deposit.txt",
        "context": context
    }

def evaluate_scenario(slug: str, answers: dict):
    if slug == "repairs":
        return evaluate_repairs(answers)
    elif slug == "deposit":
        return evaluate_deposit(answers)
    else:
        return {
            "outcome_summary": "Unknown Scenario",
            "rights_explanation": "No logic defined for this scenario.",
            "template_name": None,
            "context": {}
        }
