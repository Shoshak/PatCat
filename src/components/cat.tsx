'use client'

import { useEffect, useState } from "react"

enum CatState {
    Idling = "cat_idle.png",
    Walking = "cat_walking.jpg",
    Lying = "cat_laying.jpg",
    Petted = "cat_pat.png"
}

export default function Cat({ row }: { row: number }) {
    const [leftPos, setleftPos] = useState<number>(0)
    const [topPos, setTopPos] = useState<number>(0)

    const [catState, setCatState] = useState<CatState>(CatState.Idling)

    const [walkingRight, setWalkingRight] = useState<boolean>(false)
    const [walkingTimeLeft, setWalkingTimeLeft] = useState<number>(0)
    
    const [petTimeLeft, setPetTimeLeft] = useState<number>(0)

    useEffect(() => {
        setleftPos(Math.floor(Math.random() * 90))
        setTopPos(row * 10 + (Math.random() * 10))

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
            setPetTimeLeft(300)
        }
    }, [catState])

    useEffect(() => {
        if (catState !== CatState.Walking) {
            setWalkingTimeLeft(0)
        }

        if (leftPos > 90 && walkingRight) {
            setWalkingRight(false)
            setWalkingTimeLeft(0)
        }

        if (leftPos < 10 && !walkingRight) {
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

    return (
        <>
            <div className="w-32 h-32 hover:cursor-grab hover:-translate-y-2" style={{position : 'relative', top : `${topPos}vh`, left : `${leftPos}vw`}} onClick={pat}>
                <img src={catState} alt="" />
            </div>
        </>
    )
}