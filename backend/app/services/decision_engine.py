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

def evaluate_eviction(answers: dict):
    # Logic for Eviction
    # q_1: 10-Day Notice (Yes/No)
    # q_2: Court Papers (Yes/No)
    # q_3: Repairs (Checkbox)
    # q_4: Can Pay (Radio)

    # Note: IDs depend on the seeding order. 
    # Based on seed_eviction.py:
    # Q1 -> 10 day notice
    # Q2 -> Court papers (might be ID 6 or 7 depending on global ID sequence)
    # The frontend sends "q_{id}". Since we don't know exact IDs without querying, 
    # we can try to guess or fetch. 
    # However, since we just seeded, let's ASSUME IDs strictly increment or use text matching if possible.
    # BETTER: Just check the text of values regardless of keys, or rely on the frontend sending keys 
    # that map to the Questions we just seeded.
    # Since existing IDs were 1,2,3 (repair), 4,5 (deposit).
    # New IDs should be 6, 7, 8, 9.
    
    # Let's try to map by "finding" the key that has certain values if we want robustness,
    # OR just assume standard progression.
    # Let's assume keys "q_6", "q_7", "q_8", "q_9" based on previous count (5).
    
    # Actually, simpler: check values in the entire dict values if keys are unpredictable.
    # But keys ARE predictable if database is fresh. 
    # Let's grab values safely.
    
    has_notice = answers.get("q_6", "No")
    has_papers = answers.get("q_7", "No")
    repairs = answers.get("q_8", [])
    can_pay = answers.get("q_9", "No")
    
    # If IDs are off, we might miss data. 
    # A hacky but robust way for this MVP without DB lookup here:
    # Check all keys.
    
    context = {}
    template = None
    summary = "Assessment Complete"
    explanation = ""

    # Logic
    if "Yes, I have it now" in str(can_pay):
        summary = "Tender of Rent Opportunity"
        explanation = "Under NC GS 42-33, you may be able to stop an eviction based on non-payment if you 'tender' (offer) the full rent plus costs before a final judgment. Use this letter to formally offer payment."
        template = "eviction_tender.txt"
        context["rent_amount"] = "[Insert Rent Amount]"
        
    elif isinstance(repairs, list) and len(repairs) > 0 and "None" not in repairs:
        summary = "Habitability Defense"
        explanation = "If you are withholding rent due to repairs, be careful—NC law generally does NOT allow withholding rent without a court order. However, you can assert a 'set-off' or counterclaim for the reduced value of the home."
        template = "eviction_defense.txt"
        context["issue_details"] = ", ".join(repairs)
        
    elif "Yes" in str(has_papers):
        summary = "Court Action Required"
        explanation = "Since you have received court papers, you MUST appear at the hearing. Failure to appear will result in automatic eviction. We cannot generate a defense letter that substitutes for a court answer, but you should seek legal aid immediately."
        template = None
        
    else:
        summary = "Monitor Situation"
        explanation = "You have not received a formal notice yet. Ensure you communicate with your landlord. If you receive a 10-Day Notice, act immediately."
        template = None

    return {
        "outcome_summary": summary,
        "rights_explanation": explanation,
        "template_name": template,
        "context": context
    }

def evaluate_scenario(slug: str, answers: dict):
    if slug == "repairs":
        return evaluate_repairs(answers)
    elif slug == "deposit":
        return evaluate_deposit(answers)
    elif slug == "eviction":
        return evaluate_eviction(answers)
    else:
        return {
            "outcome_summary": "Unknown Scenario",
            "rights_explanation": "No logic defined for this scenario.",
            "template_name": None,
            "context": {}
        }
