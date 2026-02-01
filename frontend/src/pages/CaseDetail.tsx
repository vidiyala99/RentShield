import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../stores/authStore';
import { PhotoUpload } from '../components/PhotoUpload';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';

interface CasePhoto {
    id: string;
    file_path: string;
    created_at: string;
    analysis_json?: any;
}

interface CaseDetail {
    id: number;
    title: string;
    description: string;
    status: string;
    slug: string;
    case_type: string;
    created_at: string;
}

export const CaseDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { accessToken } = useAuth();
    const navigate = useNavigate();

    const [caseData, setCaseData] = useState<CaseDetail | null>(null);
    const [photos, setPhotos] = useState<CasePhoto[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'documents'>('documents');

    useEffect(() => {
        if (id) {
            fetchCaseDetails();
            fetchPhotos();
        }
    }, [id]);

    const fetchCaseDetails = async () => {
        try {
            // For now, mock or fetch from a case detail endpoint if it exists
            // Re-using my-cases list endpoint logic for now or we need a specific GET /cases/{id}
            // Let's assume GET /cases/{id} exists or we implement it.
            // Actually, looking at backend routers/cases.py (from memory), we might not have a public GET /cases/{id} yet?
            // Wait, `cases.py` had `get_case`.
            // Let's try to fetch it.
            const response = await fetch(`http://localhost:8000/cases/${id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCaseData(data);
            }
        } catch (error) {
            console.error("Error fetching case", error);
        }
    };

    const fetchPhotos = async () => {
        try {
            const response = await fetch(`http://localhost:8000/cases/${id}/photos`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            if (response.ok) {
                const data = await response.json();
                setPhotos(data);
            }
        } catch (error) {
            console.error("Error fetching photos", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUploaded = (newPhoto: CasePhoto) => {
        setPhotos(prev => [...prev, newPhoto]);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-t-2 border-[#C5A065] rounded-full"></div>
            </div>
        );
    }

    if (!caseData) return <div>Case not found</div>;

    return (
        <div className="min-h-screen bg-[#0B0E14] text-white font-['Inter']">
            {/* Nav */}
            <nav className="border-b border-[rgba(255,255,255,0.08)] bg-[rgba(21,25,33,0.95)] sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="h-6 w-px bg-gray-700"></div>
                    <div>
                        <h1 className="font-['Cinzel'] font-semibold text-lg text-white">
                            {caseData.title}
                        </h1>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">
                            Case #{caseData.id.toString().padStart(4, '0')} • {caseData.status}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Tabs */}
                        <div className="flex border-b border-[rgba(255,255,255,0.08)] mb-6">
                            <button
                                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-[#C5A065] text-[#C5A065]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </button>
                            <button
                                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'documents' ? 'border-[#C5A065] text-[#C5A065]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                                onClick={() => setActiveTab('documents')}
                            >
                                Documents
                            </button>
                        </div>

                        {activeTab === 'documents' && (
                            <div className="space-y-8">
                                {/* Upload Area */}
                                <section>
                                    <h2 className="text-xl font-['Cinzel'] mb-4">Evidence Locker</h2>
                                    <PhotoUpload caseId={caseData.id} onUploadComplete={handlePhotoUploaded} />
                                </section>

                                {/* Photo Grid */}
                                <section>
                                    <h3 className="text-sm uppercase text-gray-500 font-semibold mb-4 tracking-wider">
                                        Uploaded Files ({photos.length})
                                    </h3>

                                    {photos.length === 0 ? (
                                        <div className="text-center py-12 border border-dashed border-gray-800 rounded-lg text-gray-600">
                                            No documents uploaded yet.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {photos.map(photo => (
                                                <div key={photo.id} className="group relative bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden transition-hover hover:border-[#C5A065]">
                                                    <div className="aspect-[4/3] bg-black relative">
                                                        <img
                                                            src={`http://localhost:8000/${photo.file_path.replace(/\\/g, '/')}`}
                                                            alt="Case evidence"
                                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                        />
                                                        {/* Overlay for status */}
                                                        <div className="absolute top-2 right-2">
                                                            <span className="bg-black/50 backdrop-blur text-xs px-2 py-1 rounded-full text-white flex items-center gap-1">
                                                                <Clock size={12} className="text-[#C5A065]" /> Analyzing
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="p-3">
                                                        <div className="text-xs text-gray-500 mb-1">
                                                            {new Date(photo.created_at).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-300 truncate">
                                                            Document {photo.id.substring(0, 8)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            </div>
                        )}

                        {activeTab === 'overview' && (
                            <div className="text-gray-400">
                                <p>{caseData.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-xl p-6">
                            <h3 className="font-['Cinzel'] text-lg mb-4 text-[#C5A065]">Case AI Status</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="text-green-500 mt-0.5" size={16} />
                                    <div>
                                        <div className="text-sm text-white">Case Initialized</div>
                                        <div className="text-xs text-gray-500">System created case file</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 opacity-50">
                                    <div className="w-4 h-4 rounded-full border border-gray-600 mt-0.5"></div>
                                    <div>
                                        <div className="text-sm text-gray-300">Documents Analyzed</div>
                                        <div className="text-xs text-gray-500">Waiting for uploads</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
