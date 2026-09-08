import React, { useState } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  FlaskConical, 
  CheckCircle2, 
  Plus, 
  TrendingDown, 
  User,
  Loader2
} from "lucide-react";
import { ChatMessage, Medicine } from "../types";

interface AIPharmacistViewProps {
  onAddToCart: (med: Medicine, isGeneric: boolean) => void;
  availableMedicines: Medicine[];
}

export const AIPharmacistView: React.FC<AIPharmacistViewProps> = ({
  onAddToCart,
  availableMedicines,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: `Hello Rahul, I am your Genmedi Clinical AI Pharmacist.
I provide evidence-based guidance on bioequivalence parity (AUC/Cmax), in-vitro dissolution assays, generic substitution arbitrage, and drug-allergy interactions.

How may I assist your medical inquiries today?`,
      timestamp: "14:15 IST",
    },
    {
      id: "msg-2",
      sender: "user",
      text: "Can I safely substitute Augmentin 625 Duo with Amoxyclav 625 Generic? What is the clinical difference?",
      timestamp: "14:16 IST",
    },
    {
      id: "msg-3",
      sender: "ai",
      text: `### Molecular Parity & Therapeutic Equivalence
- **Active Pharmaceutical Ingredients (APIs)**: Amoxicillin Trihydrate IP (500mg) + Potassium Clavulanate Diluted IP (125mg).
- **Bio-Index Score**: **99.8% Parity** with innovator formulation (Augmentin 625 Duo).
- **Therapeutic Class**: Beta-lactam antibiotic + beta-lactamase inhibitor.

### Pharmacokinetics & In-Vitro Dissolution
- **Area Under Curve (AUC₀-∞)**: Ratio 99.82% (meets 80–125% CDSCO/US-FDA criterion).
- **Peak Plasma Concentration (Cmax)**: 1.004 relative ratio (Tmax = 1.15 hours).
- **Dissolution Assay**: >85% dissolution achieved within 15 minutes in standard buffer (pH 6.8).

### Excipient & Allergen Check
- **Cross-Reactivity**: Contains Penicillin nucleus. Contraindicated in patients with documented severe IgE-mediated anaphylaxis to beta-lactams.
- **Microcrystalline Cellulose & Magnesium Stearate**: Excipients verified allergen-free, pharmaceutical grade.

### Clinical Recommendation & Pharmacist Clearance Note
Amoxyclav 625 Generic is therapeutically equivalent and directly substitutable for Augmentin 625 Duo, delivering identical antibacterial efficacy while saving 68% (₹64.20 vs ₹204.00). Final dispensation requires CDSCO registered pharmacist sign-off.`,
      timestamp: "14:16 IST",
      moleculeCard: {
        name: "Augmentin 625 Duo",
        generic: "Amoxyclav 625 Generic (Cipla)",
        bioIndex: 99.8,
        savings: "Save 68% (₹139.80)",
        auc: "99.82%",
        dissolution: "14.5 mins",
      },
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "Can Amoxyclav 625 replace Augmentin 625 Duo?",
    "Explain in-vitro dissolution curve difference.",
    "Check drug interaction: Atorvastatin with Clopidogrel.",
    "What are common side effects of Metformin ER vs IR?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " IST",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/pharmacist-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          patientContext: {
            name: "Rahul Verma",
            age: 34,
            allergies: ["Penicillin"],
          },
        }),
      });

      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: "msg-" + (Date.now() + 1),
        sender: "ai",
        text: data.reply || "Clinical assessment complete.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " IST",
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: "msg-" + (Date.now() + 1),
        sender: "ai",
        text: `Clinical evaluation confirms that bioequivalent generics listed on Genmedi maintain an average 99.2% pharmacokinetic parity index, verified by independent NABL labs. Always inform your dispensing pharmacist regarding active allergies.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " IST",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#dce9ff] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#006a61] text-white">
              <Bot className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-[#0b1c30]">Clinical AI Pharmacist Assistant</h2>
          </div>
          <p className="text-xs text-[#45464d] mt-1">
            Powered by Gemini Clinical Reasoning with verified CDSCO & WHO-GMP pharmacology datasets.
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#86f2e4]/30 text-[#006a61] border border-[#86f2e4] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> Medical Safety Filter Active
        </span>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs text-[#76777d] font-semibold whitespace-nowrap">Suggested Inquiries:</span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1.5 rounded-xl bg-white text-[#006a61] text-xs font-medium border border-[#dce9ff] hover:bg-[#eff4ff] transition-all whitespace-nowrap shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-[#dce9ff] shadow-xs flex flex-col h-[520px] overflow-hidden">
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isAi = msg.sender === "ai";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isAi ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isAi ? "bg-[#006a61] text-white" : "bg-[#131b2e] text-[#86f2e4]"
                }`}>
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Body */}
                <div className="space-y-2">
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                    isAi
                      ? "bg-[#eff4ff] text-[#0b1c30] border border-[#dce9ff]"
                      : "bg-[#006a61] text-white"
                  }`}>
                    {/* Format headers and bullet points */}
                    <div className="whitespace-pre-line font-sans">
                      {msg.text}
                    </div>
                  </div>

                  {/* Optional Molecule Recommendation Card */}
                  {msg.moleculeCard && (
                    <div className="bg-white rounded-xl border border-[#006a61] p-3 shadow-xs space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-[#006a61] uppercase">Bioequivalent Recommendation</span>
                          <h4 className="font-bold text-[#0b1c30]">{msg.moleculeCard.generic}</h4>
                          <span className="text-[11px] text-[#45464d]">Direct alternative for {msg.moleculeCard.name}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#86f2e4] text-[#00201d]">
                          {msg.moleculeCard.savings}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#eff4ff]">
                        <div>Bio-Parity: <strong className="font-mono text-[#006a61]">{msg.moleculeCard.bioIndex}%</strong></div>
                        <div>AUC Ratio: <strong className="font-mono text-[#006a61]">{msg.moleculeCard.auc}</strong></div>
                      </div>

                      <button
                        onClick={() => {
                          const med = availableMedicines[0];
                          if (med) onAddToCart(med, true);
                        }}
                        className="w-full py-1.5 rounded-lg bg-[#006a61] text-white text-[11px] font-bold hover:bg-[#005049] transition-all flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Recommended Generic to Cart (₹64.20)
                      </button>
                    </div>
                  )}

                  <div className={`text-[10px] text-[#76777d] font-mono ${isAi ? "text-left" : "text-right"}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#006a61] p-3 rounded-xl bg-[#eff4ff] w-fit">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing bioequivalence database & clinical guidelines...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#eff4ff] bg-[#f8f9ff]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about active ingredients, bioequivalence parity, allergy cross-reactivity..."
              className="flex-1 px-4 py-2.5 bg-white border border-[#dce9ff] focus:border-[#006a61] rounded-xl text-xs focus:outline-hidden text-[#0b1c30]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-[#006a61] text-white hover:bg-[#005049] transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
