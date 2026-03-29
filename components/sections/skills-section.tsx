/**
 * SkillsSection
 * Responsive rotating orbital tech stack + category cards
 */

'use client'

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Cpu, Globe, Server, Settings, Code } from "lucide-react"
import Link from "next/link"
import { useSkills } from "@/hooks/useSkills"
import type { Skill as ManagedSkill } from "@/lib/types"
import Image from "next/image"

type Category = "frontend" | "backend" | "devops" | "languages" | "tools"


/* ------------------------------------------------ */
/* TECH ICON MAP */
/* ------------------------------------------------ */

const TECH_STACK = {
    react: { icon: Code, color: "#61DAFB" },
    nextjs: { icon: Globe, color: "#111827" },
    tailwind: { icon: Settings, color: "#38BDF8" },
    typescript: { icon: Code, color: "#3178C6" },
    javascript: { icon: Code, color: "#F7DF1E" },
    nodejs: { icon: Server, color: "#68A063" },
    mongodb: { icon: Server, color: "#47A248" },
    postgresql: { icon: Server, color: "#336791" },
    mysql: { icon: Server, color: "#4479A1" },
    docker: { icon: Settings, color: "#2496ED" },
    redis: { icon: Server, color: "#DC382D" },
    python: { icon: Code, color: "#3776AB" },
    graphql: { icon: Cpu, color: "#E10098" },
    aws: { icon: Settings, color: "#FF9900" },
    kubernetes: { icon: Settings, color: "#326CE5" },
    github: { icon: Code, color: "#FFFFFF" },
    git: { icon: Code, color: "#F05032" }
} as const

const TECH_LOGOS: Record<string, { slug: string; color: string; monochrome?: boolean }> = {
    react: { slug: "react", color: "61DAFB" },
    nextjs: { slug: "nextdotjs", color: "000000", monochrome: true },
    tailwind: { slug: "tailwindcss", color: "38BDF8" },
    typescript: { slug: "typescript", color: "3178C6" },
    javascript: { slug: "javascript", color: "F7DF1E" },
    nodejs: { slug: "nodedotjs", color: "339933" },
    mongodb: { slug: "mongodb", color: "47A248" },
    postgresql: { slug: "postgresql", color: "336791" },
    mysql: { slug: "mysql", color: "4479A1" },
    docker: { slug: "docker", color: "2496ED" },
    redis: { slug: "redis", color: "DC382D" },
    python: { slug: "python", color: "3776AB" },
    graphql: { slug: "graphql", color: "E10098" },
    aws: { slug: "amazonaws", color: "FF9900" },
    kubernetes: { slug: "kubernetes", color: "326CE5" },
    git: { slug: "git", color: "F05032" },
    github: { slug: "github", color: "000000", monochrome: true },
} as const

const TECH_ALIASES: Record<string, keyof typeof TECH_STACK> = {
    reactjs: "react",
    next: "nextjs",
    nextdotjs: "nextjs",
    nextjs14: "nextjs",
    tailwindcss: "tailwind",
    tailwindcss3: "tailwind",
    ts: "typescript",
    js: "javascript",
    node: "nodejs",
    nodedotjs: "nodejs",
    mongo: "mongodb",
    mongodbatlas: "mongodb",
    postgres: "postgresql",
    postgressql: "postgresql",
    postgre: "postgresql",
    mysql: "mysql",
    sql: "mysql",
    py: "python",
    gql: "graphql",
    aws: "aws",
    amazonwebservices: "aws",
    k8s: "kubernetes",
    kubernetes: "kubernetes",
    github: "github",
    git: "git",
}

function resolveTechKey(skill: ManagedSkill) {
    const rawKey = (skill.icon || skill.name).toLowerCase().replace(/[^a-z0-9]/g, "")
    return TECH_ALIASES[rawKey] || (rawKey as keyof typeof TECH_STACK)
}

function getTechLogoUrl(skill: ManagedSkill) {
    const key = resolveTechKey(skill)
    const logo = TECH_LOGOS[key]
    if (!logo) {
        return ""
    }
    return `https://cdn.simpleicons.org/${logo.slug}/${logo.color}`
}

function isMonochromeLogo(skill: ManagedSkill) {
    const key = resolveTechKey(skill)
    return Boolean(TECH_LOGOS[key]?.monochrome)
}

function SkillLogo({
    skill,
    className
}: { skill: ManagedSkill; className?: string }) {
    const logoUrl = getTechLogoUrl(skill)
    const mono = isMonochromeLogo(skill)
    const src = logoUrl || "/placeholder-logo.svg"
    const isRemote = src.startsWith("http")
    return (
        <Image
            src={src}
            alt={`${skill.name} logo`}
            title={skill.name}
            width={20}
            height={20}
            className={`${className ?? "h-5 w-5"}${mono ? " dark:invert" : ""} object-contain`}
            unoptimized={isRemote}
        />
    )
}


/* ------------------------------------------------ */
/* CATEGORY CONFIG */
/* ------------------------------------------------ */

const categoryConfig = {

    frontend: { icon: Globe, label: "Frontend" },
    backend: { icon: Server, label: "Backend" },
    devops: { icon: Settings, label: "DevOps" },
    languages: { icon: Code, label: "Languages" },
    tools: { icon: Code, label: "Tools" }


}


/* ------------------------------------------------ */
/* ORBIT CONFIG (radius = ring_size / 2) */
/* ------------------------------------------------ */

const ORBIT_CONFIG = {

    frontend: { radius: 140, duration: 25 },
    backend: { radius: 210, duration: 35 },
    devops: { radius: 280, duration: 45 },
    languages: { radius: 350, duration: 55 }

}

const ORBIT_RINGS = {
    frontend: 280,
    backend: 420,
    devops: 560,
    languages: 700
}

const ORBIT_BASE_SIZE = 320


/* ------------------------------------------------ */
/* SKILL ORB */
/* ------------------------------------------------ */

function SkillOrb({
    skill,
    index,
    total,
    radius
}: { skill: ManagedSkill, index: number, total: number, radius: number }) {

    const techKey = resolveTechKey(skill)
    const tech = TECH_STACK[techKey]

    const angle = (index / total) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    const formatOrbitValue = (value: number) => {
        const abs = Math.abs(value)
        const rounded = Math.round(abs * 1000) / 1000
        const sign = value >= 0 ? "+" : "-"
        return `calc(50% ${sign} ${rounded.toFixed(3)}px)`
    }

    return (

        <div
            className="absolute group cursor-pointer"
            style={{
                left: formatOrbitValue(x),
                top: formatOrbitValue(y),
                transform: "translate(-50%, -50%)"
            }}
        >

            <div className="relative">

                {/* glow */}

                <div
                    className="absolute inset-0 w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition"
                    style={{ background: tech?.color || "rgba(34,211,238,0.45)" }}
                />

                {/* orb */}

                <div className="
w-10 h-10
md:w-12 md:h-12
lg:w-16 lg:h-16
rounded-full
glass-card
border border-white/10
flex items-center justify-center
group-hover:scale-110 transition
">

                    <SkillLogo
                        skill={skill}
                        className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7"
                    />

                </div>

                {/* tooltip */}

                <div className="
absolute
-top-7
left-1/2
-translate-x-1/2
text-[10px]
md:text-xs
opacity-0
group-hover:opacity-100
transition
font-mono
whitespace-nowrap
">

                    {skill.name}

                </div>

            </div>

        </div>

    )

}


/* ------------------------------------------------ */
/* ORBIT LAYER */
/* ------------------------------------------------ */

function OrbitLayer({
    skills,
    radius,
    duration
}: { skills: ManagedSkill[], radius: number, duration: number }) {

    return (

        <motion.div
            animate={{ rotate: 360 }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "linear"
            }}
            className="absolute w-full h-full"
        >

            {skills.map((skill, index) => (

                <SkillOrb
                    key={skill.id}
                    skill={skill}
                    index={index}
                    total={skills.length}
                    radius={radius}
                />

            ))}

        </motion.div>

    )

}


/* ------------------------------------------------ */
/* CATEGORY CARD */
/* ------------------------------------------------ */

function CategoryCard({
    category,
    skills
}: { category: Category, skills: ManagedSkill[] }) {

    const config = categoryConfig[category]
    const Icon = config.icon

    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl p-6"
        >

            <div className="flex items-center gap-3 mb-4">

                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                </div>

                <h3 className="text-lg font-semibold">
                    {config.label}
                </h3>

            </div>

            <div className="space-y-3">

                {skills.map((skill) => (

                    <div key={skill.id}>

                        <div className="flex justify-between text-sm mb-1">

                            <span>{skill.name}</span>
                            <span className="text-primary">{skill.proficiency}%</span>

                        </div>

                        <div className="h-1.5 rounded bg-secondary">

                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.proficiency}%` }}
                                transition={{ duration: 1 }}
                                className="h-full bg-gradient-to-r from-primary to-accent"
                            />

                        </div>

                    </div>

                ))}

            </div>

        </motion.div>

    )

}


/* ------------------------------------------------ */
/* MAIN */
/* ------------------------------------------------ */

export default function SkillsSection() {

    const ref = useRef(null)
    useInView(ref, { once: true })
    const { skills: liveSkills, isLoading } = useSkills()
    const orbitRef = useRef<HTMLDivElement | null>(null)
    const [orbitScale, setOrbitScale] = useState(1)

    useEffect(() => {
        const element = orbitRef.current
        if (!element) {
            return
        }

        const updateScale = () => {
            const { width } = element.getBoundingClientRect()
            if (!width) {
                return
            }
            const nextScale = Math.min(1, width / ORBIT_BASE_SIZE)
            setOrbitScale(nextScale)
        }

        updateScale()
        const observer = new ResizeObserver(updateScale)
        observer.observe(element)
        return () => observer.disconnect()
    }, [])

    const frontend = liveSkills.filter((skill: ManagedSkill) => skill.category === "frontend")
    const backend = liveSkills.filter((skill: ManagedSkill) => skill.category === "backend")
    const devops = liveSkills.filter((skill: ManagedSkill) => skill.category === "devops")
    const languages = liveSkills.filter((skill: ManagedSkill) => skill.category === "languages")
    const frontendCards = frontend
    const backendCards = backend
    const devopsCards = devops
    const languageCards = languages
    const toolsCards = liveSkills.filter((skill: ManagedSkill) => skill.category === "tools")
    const hasOrbitalSkills = frontend.length > 0 || backend.length > 0 || devops.length > 0 || languages.length > 0
    const hasAnySkills = liveSkills.length > 0
    const scaledOrbitConfig = {
        frontend: { ...ORBIT_CONFIG.frontend, radius: ORBIT_CONFIG.frontend.radius * orbitScale },
        backend: { ...ORBIT_CONFIG.backend, radius: ORBIT_CONFIG.backend.radius * orbitScale },
        devops: { ...ORBIT_CONFIG.devops, radius: ORBIT_CONFIG.devops.radius * orbitScale },
        languages: { ...ORBIT_CONFIG.languages, radius: ORBIT_CONFIG.languages.radius * orbitScale },
    }
    const ringSizes = {
        frontend: ORBIT_RINGS.frontend * orbitScale,
        backend: ORBIT_RINGS.backend * orbitScale,
        devops: ORBIT_RINGS.devops * orbitScale,
        languages: ORBIT_RINGS.languages * orbitScale,
    }

    return (

        <section
            id="skills"
            ref={ref}
            className="relative py-24 md:py-32 overflow-hidden"
        >

            <div className="container mx-auto px-4">

                {/* HEADER */}

                <div className="text-center mb-16">

                    <span className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm text-primary">

                        <Cpu size={16} />
                        TECH STACK

                    </span>

                    <h2 className="text-3xl md:text-5xl font-bold mt-6">
                        Full Stack Skills in <span className="text-accent">Next.js, Node.js, AI</span>
                    </h2>
                    <p className="mt-4 mx-auto max-w-3xl text-sm md:text-base text-muted-foreground">
                        I focus on the tools that help ship production ready apps: Next.js App Router for modern UX,
                        Node.js APIs for scalable data, and AI workflows for automation and personalization. As a Full Stack Developer,
                        I combine design systems, strong typing, and performance tuning so each feature feels fast, accessible, and easy to maintain.
                    </p>
                    <p className="mt-3 mx-auto max-w-3xl text-sm md:text-base text-muted-foreground">
                        You will see frontend skills mapped to the experiences users touch, backend skills tied to reliability,
                        and DevOps practices that keep deployments smooth. This is the practical stack behind my AI Developer Portfolio,
                        tailored for real products and measurable results.
                    </p>

                </div>


                {/* ORBITAL SYSTEM */}

                <div className="flex justify-center relative mb-20">

                    {hasOrbitalSkills ? (
                        <div
                            ref={orbitRef}
                            className="
relative
w-full max-w-[320px] aspect-square
md:w-[520px] md:h-[520px]
lg:w-[700px] lg:h-[700px]
"
                        >

                            {/* CORE */}

                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">

                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="
w-16 h-16
md:w-20 md:h-20
lg:w-24 lg:h-24
rounded-full
bg-gradient-to-br
from-primary
to-accent
flex items-center justify-center
"
                                >

                                    <Cpu className="text-white w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />

                                </motion.div>

                            </div>


                            {/* ORBIT RINGS */}

                            <div
                                style={{ width: ringSizes.frontend, height: ringSizes.frontend }}
                                className="
absolute
border border-dashed border-blue-400/30
rounded-full
left-1/2 top-1/2
-translate-x-1/2 -translate-y-1/2
"
                            />

                            <div
                                style={{ width: ringSizes.backend, height: ringSizes.backend }}
                                className="
hidden md:block
absolute
border border-dashed border-green-400/30
rounded-full
left-1/2 top-1/2
-translate-x-1/2 -translate-y-1/2
"
                            />

                            <div
                                style={{ width: ringSizes.devops, height: ringSizes.devops }}
                                className="
hidden lg:block
absolute
border border-dashed border-purple-400/30
rounded-full
left-1/2 top-1/2
-translate-x-1/2 -translate-y-1/2
"
                            />

                            <div
                                style={{ width: ringSizes.languages, height: ringSizes.languages }}
                                className="
hidden lg:block
absolute
border border-dashed border-yellow-400/30
rounded-full
left-1/2 top-1/2
-translate-x-1/2 -translate-y-1/2
"
                            />


                            {/* ORBITS */}

                            <OrbitLayer skills={frontend} {...scaledOrbitConfig.frontend} />

                            <div className="hidden md:block">
                                <OrbitLayer skills={backend} {...scaledOrbitConfig.backend} />
                            </div>

                            <div className="hidden lg:block">
                                <OrbitLayer skills={devops} {...scaledOrbitConfig.devops} />
                                <OrbitLayer skills={languages} {...scaledOrbitConfig.languages} />
                            </div>

                        </div>
                    ) : (
                        <div className="glass-card rounded-2xl px-6 py-10 text-center max-w-xl">
                            <p className="text-lg font-medium text-foreground">
                                {isLoading ? "Loading skills..." : "No skills added yet."}
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Add skills from the admin panel to display your tech stack here.
                            </p>
                        </div>
                    )}

                </div>


                {/* CATEGORY GRID */}

                {hasAnySkills ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6" >

                        {frontendCards.length > 0 ? <CategoryCard category="frontend" skills={frontendCards} /> : null}
                        {backendCards.length > 0 ? <CategoryCard category="backend" skills={backendCards} /> : null}
                        {devopsCards.length > 0 ? <CategoryCard category="devops" skills={devopsCards} /> : null}
                        {languageCards.length > 0 ? <CategoryCard category="languages" skills={languageCards} /> : null}
                        {toolsCards.length > 0 ? <CategoryCard category="tools" skills={toolsCards} /> : null}

                    </div>
                ) : null}

                <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
                    <Link className="hover:text-primary transition-colors" href="/case-studies">View Case Studies</Link>
                    <Link className="hover:text-primary transition-colors" href="/blog">Read the Blog</Link>
                    <Link className="hover:text-primary transition-colors" href="/contact">Work With Me</Link>
                </div>

            </div>

        </section>

    )

}
