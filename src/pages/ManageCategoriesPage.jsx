import { useState } from 'react';
import { HiOutlineTag, HiPlus, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';

const ManageCategoriesPage = () => {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Lectures', color: '#6366f1' },
        { id: 2, name: 'Assignments', color: '#ec4899' },
        { id: 3, name: 'Exams', color: '#ef4444' },
        { id: 4, name: 'Personal', color: '#10b981' }
    ]);
    const [newCatName, setNewCatName] = useState('');

    const addCategory = (e) => {
        e.preventDefault();
        if (newCatName.trim()) {
            setCategories([...categories, { id: Date.now(), name: newCatName, color: '#8b5cf6' }]);
            setNewCatName('');
        }
    };

    const deleteCategory = (id) => {
        setCategories(categories.filter(c => c.id !== id));
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Manage Categories</h1>
                    <p className="page-subtitle">Organize your events and tasks</p>
                </div>
                <div style={{ padding: 12, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', color: 'var(--primary-blue)' }}>
                    <HiOutlineTag size={28} />
                </div>
            </div>

            <form onSubmit={addCategory} className="card" style={{ padding: 24, marginBottom: 24, display: 'flex', gap: 12 }}>
                <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="New category name..."
                    style={{ flex: 1, padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                />
                <button type="submit" className="btn-filled" style={{ whiteSpace: 'nowrap' }}>
                    <HiPlus className="mr-2" /> Add Category
                </button>
            </form>

            <div style={{ display: 'grid', gap: 12 }}>
                {categories.map(cat => (
                    <div key={cat.id} className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 16, height: 16, borderRadius: '50%', background: cat.color }} />
                            <span style={{ fontWeight: 600 }}>{cat.name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="icon-btn" style={{ color: 'var(--text-secondary)' }}>
                                <HiOutlinePencil size={20} />
                            </button>
                            <button className="icon-btn" onClick={() => deleteCategory(cat.id)} style={{ color: 'var(--error-red)' }}>
                                <HiOutlineTrash size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageCategoriesPage;
