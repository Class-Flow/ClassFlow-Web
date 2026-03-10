import { useState } from 'react';
import AnimatedAvatar from './AnimatedAvatar';
import './AvatarCustomizer.css';
import { HiOutlineRefresh } from 'react-icons/hi';

const AvatarCustomizer = ({ initialAvatar, onAvatarSelected, onCancel }) => {
    const defaultAvatar = {
        bodyStyle: 'circle',
        bodyColor: '#4ECDC4',
        eyesStyle: 'round',
        eyesColor: '#000000',
        mouthStyle: 'smile',
        accentColor: '#FF6B9D',
        hasGlasses: false
    };

    const [avatar, setAvatar] = useState(initialAvatar || defaultAvatar);
    const [colorTypePicker, setColorTypePicker] = useState(null); // 'body', 'eyes', 'accent'

    const bodyColors = [
        '#FF6B9D', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
        '#F7DC6F', '#BB8FCE', '#85C1E2', '#FFD93D', '#A8E6CF',
        '#FFB6C1', '#DDA0DD', '#87CEEB', '#F0E68C', '#FF69B4',
        '#3366FF', '#00CED1', '#FF1493', '#32CD32', '#FFD700',
    ];

    const eyeColors = [
        '#000000', '#3366FF', '#FF0000', '#00AA00',
        '#FFB6C1', '#4B0082', '#FF69B4', '#00CED1',
    ];

    const handleRandomize = () => {
        const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
        setAvatar({
            bodyStyle: randomItem(['circle', 'square', 'rounded']),
            bodyColor: randomItem(bodyColors),
            eyesStyle: randomItem(['round', 'square', 'x_eyes']),
            eyesColor: randomItem(eyeColors),
            mouthStyle: randomItem(['smile', 'neutral', 'surprised', 'box']),
            accentColor: randomItem(bodyColors),
            hasGlasses: Math.random() > 0.5
        });
    };

    const renderColorPicker = () => {
        if (!colorTypePicker) return null;
        const colors = colorTypePicker === 'eyes' ? eyeColors : bodyColors;

        return (
            <div className="color-picker-modal">
                <div className="color-picker-content">
                    <h3>Select {colorTypePicker.charAt(0).toUpperCase() + colorTypePicker.slice(1)} Color</h3>
                    <div className="color-grid">
                        {colors.map(color => (
                            <div
                                key={color}
                                className="color-circle"
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                    setAvatar(prev => ({
                                        ...prev,
                                        [colorTypePicker === 'body' ? 'bodyColor' : colorTypePicker === 'eyes' ? 'eyesColor' : 'accentColor']: color
                                    }));
                                    setColorTypePicker(null);
                                }}
                            />
                        ))}
                    </div>
                    <button className="btn-filled-auth mt-3" onClick={() => setColorTypePicker(null)}>Close</button>
                </div>
            </div>
        );
    };

    return (
        <div className="avatar-customizer">
            <div className="preview-section">
                <h3>Avatar Preview</h3>
                <AnimatedAvatar avatar={avatar} size={140} />
                <button className="btn-filled randomize-btn" onClick={handleRandomize}>
                    <HiOutlineRefresh /> Randomize Avatar
                </button>
            </div>

            <div className="options-section">
                <div className="option-group">
                    <label>Body Style</label>
                    <div className="chip-row">
                        {['circle', 'square', 'rounded'].map(style => (
                            <button
                                key={style}
                                className={`chip ${avatar.bodyStyle === style ? 'active' : ''}`}
                                onClick={() => setAvatar({ ...avatar, bodyStyle: style })}
                            >
                                {style.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="option-group">
                    <label>Body Color</label>
                    <div
                        className="color-selector-btn"
                        style={{ backgroundColor: avatar.bodyColor }}
                        onClick={() => setColorTypePicker('body')}
                    >
                        Tap to Change Color
                    </div>
                </div>

                <div className="option-group">
                    <label>Eyes</label>
                    <div className="chip-row">
                        {['round', 'square', 'x_eyes'].map(style => (
                            <button
                                key={style}
                                className={`chip ${avatar.eyesStyle === style ? 'active' : ''}`}
                                onClick={() => setAvatar({ ...avatar, eyesStyle: style })}
                            >
                                {style.replace('_', ' ').toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="option-group">
                    <label>Eyes Color</label>
                    <div
                        className="color-selector-btn"
                        style={{ backgroundColor: avatar.eyesColor, color: '#fff' }}
                        onClick={() => setColorTypePicker('eyes')}
                    >
                        Tap to Change Color
                    </div>
                </div>

                <div className="option-group">
                    <label>Mouth</label>
                    <div className="chip-row">
                        {['smile', 'neutral', 'surprised', 'box'].map(style => (
                            <button
                                key={style}
                                className={`chip ${avatar.mouthStyle === style ? 'active' : ''}`}
                                onClick={() => setAvatar({ ...avatar, mouthStyle: style })}
                            >
                                {style.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="option-group">
                    <label>Mouth Color</label>
                    <div
                        className="color-selector-btn"
                        style={{ backgroundColor: avatar.accentColor }}
                        onClick={() => setColorTypePicker('accent')}
                    >
                        Tap to Change Color
                    </div>
                </div>

                <div className="option-group">
                    <label>Accessories</label>
                    <div className="accessory-toggle">
                        <span>Glasses</span>
                        <div
                            className={`toggle-switch ${avatar.hasGlasses ? 'active' : ''}`}
                            onClick={() => setAvatar({ ...avatar, hasGlasses: !avatar.hasGlasses })}
                        >
                            <div className="toggle-thumb" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="actions-section">
                <button className="btn-outline" onClick={onCancel}>Cancel</button>
                <button className="btn-filled" onClick={() => onAvatarSelected(avatar)}>Select Avatar</button>
            </div>

            {renderColorPicker()}
        </div>
    );
};

export default AvatarCustomizer;
