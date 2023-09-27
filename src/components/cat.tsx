'use client'

import { useEffect, useState } from "react"

enum CatState {
    Idling,
    Walking,
    Lying,
    Petted
}

export default function Cat({ row }: { row: number }) {
    const [catPosition, setCatPosition] = useState<number>(0)
    const [catState, setCatState] = useState<CatState>(CatState.Idling)
    const [walkingRight, setWalkingRight] = useState<boolean>(false)
    const [walkingInterval, setWalkingInterval] = useState<NodeJS.Timeout | null>(null)
    const [catImg, setCatImg] = useState<string>("/cat_idle.png")

    useEffect(() => {
        setCatPosition(Math.floor(Math.random() * 90))
    }, [])

    useEffect(() => {
        const question = setInterval(() => {
            setCatState((cs) => {
                const randValue = Math.floor(Math.random() * 100)
                if (cs === CatState.Idling) {
                    if (randValue <= 10) {
                        return CatState.Walking
                    } else if (randValue > 10 && randValue <= 20) {
                        return CatState.Lying
                    } else {
                        return CatState.Idling
                    }
                } else if (cs === CatState.Lying) {
                    if (randValue < 20) {
                        if (randValue < 10) {
                            return CatState.Idling
                        } else {
                            return CatState.Walking
                        }
                    } else {
                        return cs
                    }
                } else {
                    return cs
                }
            })
            if (Math.floor(Math.random() * 100) <= 20) {
                setWalkingRight((w) => !w)
            }

        }, 2000)

        return () => clearInterval(question)
    }, [])

    useEffect(() => {
        if (catState === CatState.Walking) {
            setCatImg("cat_walking.jpg")
            setWalkingInterval(setInterval(() => {
                setCatState((cs) => {
                    if (cs !== CatState.Walking) {
                        console.log("fire")
                        setWalkingInterval((wi) => {
                            if (wi !== null) {
                                clearInterval(wi)
                            }
                            return null
                        })
                    }
    
                    if (walkingRight) {
                        setCatPosition((CP) => CP + 0.05)
                    } else {
                        setCatPosition((CP) => CP - 0.05)
                    }

                    return cs
                })
            }, 10))

            setTimeout(() => {
                setCatState((cs) => {
                    if (cs === CatState.Walking) {
                        return CatState.Idling
                    } else {
                        return cs
                    }
                })
                setWalkingInterval((wi) => {
                    if (wi !== null) {
                        clearInterval(wi)
                    }
                    return null
                })
            }, Math.random() * 4000)
        } else if (catState === CatState.Lying) {
            setCatImg("cat_laying.jpg")
        } else if (catState === CatState.Idling) {
            setCatImg("cat_idle.png")
        } else if (catState === CatState.Petted) {
            setCatImg("cat_pat.png")
        }
    }, [catState])

    function pat() {
        setCatState(CatState.Petted)
        setInterval(() => {
            setCatState(CatState.Idling)
        }, 3000)
    }

    return (
        <>
            <div className="w-32 h-32 hover:cursor-grab hover:-translate-y-2" style={{position : 'relative', top : `${row * 10}vh`, left : `${catPosition}vw`}} onClick={pat}>
                <img src={catImg} alt="" />
            </div>
        </>
    )
}