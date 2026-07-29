'use client'
import React, {FunctionComponent, useEffect, useState} from 'react';
import {randomFaceEmoji} from '@/components/utils/faceEmoji';

interface Props {
    readonly className?: string
}

// Renders a random face emoji, re-rolled on every visit. The emoji is picked
// after mount so the static (SSG) markup and the first client render match.
const RandomFace: FunctionComponent<Props> = ({className}) => {
    const [emoji, setEmoji] = useState<string | null>(null);

    useEffect(() => {
        setEmoji(randomFaceEmoji());
    }, []);

    return <span className={className}>{emoji}</span>;
};

export default RandomFace;
