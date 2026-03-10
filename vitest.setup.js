import '@testing-library/jest-dom';

// Mock canvas to prevent errors in JSDOM
HTMLCanvasElement.prototype.getContext = () => {
    return {
        clearRect: () => { },
        fillRect: () => { },
        strokeRect: () => { },
        beginPath: () => { },
        moveTo: () => { },
        lineTo: () => { },
        stroke: () => { },
        fill: () => { },
        arc: () => { },
        ellipse: () => { },
        roundRect: () => { },
        scale: () => { },
    };
};
