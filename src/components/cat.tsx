'use client'

import { useEffect, useMemo, useState } from "react"

enum CatState {
    Idling,
    Walking,
    LyingDown,
    Lying,
    StandingUp,
    Petted
}

export default function Cat({ row }: { row: number }) {
    const [leftPos, setleftPos] = useState<number>(0)
    const topPos = useMemo(() => row * 10 + (Math.random() * 8), [])

    const [catState, setCatState] = useState<CatState>(CatState.Idling)
    const catImg = useMemo(chooseImg, [catState])

    const [walkingRight, setWalkingRight] = useState<boolean>(false)
    const [walkingTimeLeft, setWalkingTimeLeft] = useState<number>(0)

    const [petTimeLeft, setPetTimeLeft] = useState<number>(0)

    useEffect(() => {
        setleftPos(Math.floor(Math.random() * 90))
        
        const question = setInterval(() => {
            setCatState((cs) => {
                const randValue = Math.floor(Math.random() * 100)
                if (cs === CatState.Idling) {
                    if (randValue <= 10) {
                        return CatState.Walking
                    } else if (randValue > 10 && randValue <= 20) {
                        return CatState.LyingDown
                    } else {
                        return cs
                    }
                } else if (cs === CatState.Lying) {
                    if (randValue < 20) {
                        return CatState.StandingUp
                    } else {
                        return cs
                    }
                } else {
                    return cs
                }
            })

        }, 2000)

        return () => clearInterval(question)
    }, [])

    useEffect(() => {
        if (catState === CatState.Walking) {
            if (Math.floor(Math.random() * 100) <= 20) {
                setWalkingRight((w) => !w)
            }
            setWalkingTimeLeft(Math.random() * 800)
        } else if (catState === CatState.Petted) {
            setPetTimeLeft(240)
        } else if (catState === CatState.LyingDown) {
            setTimeout(() => {
                setCatState((cs) => {
                    if (cs === CatState.LyingDown) {
                        return CatState.Lying
                    } else {
                        return cs
                    }
                })
            }, 2000)
        } else if (catState === CatState.StandingUp) {
            setTimeout(() => {
                setCatState((cs) => {
                    if (cs === CatState.StandingUp) {
                        if (Math.random() * 10 > 3) {
                            return CatState.Idling
                        } else {
                            return CatState.Walking
                        }
                    } else {
                        return cs
                    }
                })

            }, 2500)
        }
    }, [catState])

    useEffect(() => {
        if (catState !== CatState.Walking) {
            setWalkingTimeLeft(0)
        }

        if (leftPos > 85 && walkingRight) {
            setWalkingRight(false)
            setWalkingTimeLeft(0)
        }

        if (leftPos < 15 && !walkingRight) {
            setWalkingRight(true)
            setWalkingTimeLeft(0)
        }

        setTimeout(() => {
            setleftPos(CP => CP + (walkingRight ? 0.05 : -0.05))
            if (walkingTimeLeft <= 0) {
                setCatState(CatState.Idling)
            } else {
                setWalkingTimeLeft(WTL =>  WTL - 1)
            }
        }, 10)
    }, [walkingTimeLeft])

    useEffect(() => {
        setTimeout(() => {
            if (petTimeLeft <= 0) {
                setCatState(CatState.Idling)
            } else {
                setPetTimeLeft(PTL => PTL - 1)
            }
        }, 10)
    }, [petTimeLeft])

    function pat() {
        setCatState(CatState.Petted)
    }

    function chooseImg(): string {
        if (catState === CatState.Idling) {
            return "kotstoit.gif"
        } else if (catState === CatState.Walking) {
            return "kothodit.gif"
        } else if (catState === CatState.Petted) {
            return Math.random() * 10 < 2 ? "kotutug.gif" : "kotgladit.gif"
        } else if (catState === CatState.LyingDown) {
            return "kotjegit.gif"
        } else if (catState === CatState.Lying) {
            return "kotzoomlezit.gif"
        } else if (catState === CatState.StandingUp) {
            return "kotvstayot.gif"
        } else {
            return "kotstoit.gif"
        }
    }

    return (
        <>
            <div className="w-32 h-32 hover:cursor-grab" style={{position : 'relative', top : `${topPos}vh`, left : `${leftPos}vw`}} onClick={pat}>
                <img style={{transform: `scaleX(${walkingRight ? "-1" : "1"})`}} src={catImg} alt="" />
            </div>
        </>
    )
}