import React from 'react'

const Alphabet = ({ selectedLetter, handleLetterClick }) => {
    const alphabet = Array.from({ length: 26 }, (_, i) =>
        String.fromCharCode(65 + i)
    );
    return (
        <>
            {alphabet.map((letter) => (
                <button key={letter} style={{ margin: "5px" }} className={selectedLetter === letter ? 'active' : ''}
                    onClick={() => handleLetterClick(letter)} >
                    {letter}
                </button>
            ))}
        </>
    )
}

export default Alphabet