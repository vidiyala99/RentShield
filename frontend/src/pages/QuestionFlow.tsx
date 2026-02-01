import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProgressBar from '../components/ProgressBar';

interface Question {
    id: number;
    text: string;
    type: string;
    options?: string[];
    required: boolean;
}

const QuestionFlow: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8000/scenarios/${id}/questions`)
            .then(res => setQuestions(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (questions.length === 0) return <div className="container"><p>Loading questions...</p></div>;

    const currentQ = questions[currentStep];

    const handleOptionChange = (value: string) => {
        const key = `q_${currentQ.id}`;
        if (currentQ.type === 'radio') {
            setAnswers(prev => ({ ...prev, [key]: value }));
        } else if (currentQ.type === 'checkbox') {
            setAnswers(prev => {
                const current = prev[key] || [];
                if (current.includes(value)) {
                    return { ...prev, [key]: current.filter((v: string) => v !== value) };
                } else {
                    return { ...prev, [key]: [...current, value] };
                }
            });
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = `q_${currentQ.id}`;
        setAnswers(prev => ({ ...prev, [key]: e.target.value }));
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:8000/scenarios/${id}/evaluate`, { answers });
            navigate('/result', { state: { result: response.data } });
        } catch (err) {
            console.error("Evaluation failed", err);
            alert("Failed to generate result. Please check your connection.");
            setLoading(false);
        }
    };

    const isAnswered = () => {
        if (!currentQ.required) return true;
        const val = answers[`q_${currentQ.id}`];
        return val && val.length > 0;
    };

    return (
        <div className="container fade-in">
            <div className="card glass">
                <ProgressBar current={currentStep} total={questions.length} />
                <h2 className="gradient-text">Question {currentStep + 1} of {questions.length}</h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{currentQ.text}</p>

                <div className="placeholder-form">
                    {currentQ.type === 'text' && (
                        <input
                            type="text"
                            placeholder="Type your answer..."
                            value={answers[`q_${currentQ.id}`] || ''}
                            onChange={handleTextChange}
                        />
                    )}

                    {(currentQ.type === 'radio' || currentQ.type === 'checkbox') && currentQ.options?.map(opt => {
                        const key = `q_${currentQ.id}`;
                        const isChecked = currentQ.type === 'radio'
                            ? answers[key] === opt
                            : (answers[key] || []).includes(opt);

                        return (
                            <div key={opt} style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                                <input
                                    type={currentQ.type}
                                    name={key}
                                    checked={isChecked}
                                    onChange={() => handleOptionChange(opt)}
                                    style={{ marginRight: '12px', height: '1.2rem', width: '1.2rem' }}
                                />
                                <span onClick={() => handleOptionChange(opt)} style={{ cursor: 'pointer' }}>{opt}</span>
                            </div>
                        );
                    })}

                    <div className="actions" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                        {currentStep > 0 ? (
                            <button onClick={() => setCurrentStep(prev => prev - 1)} className="btn btn-secondary">Back</button>
                        ) : (
                            <Link to="/" className="btn btn-secondary">Cancel</Link>
                        )}

                        {currentStep < questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentStep(prev => prev + 1)}
                                className="btn btn-primary"
                                disabled={!isAnswered()}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handleFinish}
                                className="btn btn-primary"
                                disabled={loading || !isAnswered()}
                            >
                                {loading ? 'Generating...' : 'Finish & Generate'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionFlow;
