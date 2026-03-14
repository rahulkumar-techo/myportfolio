/**
 * SkillsSection
 * Responsive rotating orbital tech stack + category cards
 */

'use client'

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Cpu, Globe, Server, Settings, Code } from "lucide-react"
import { useSkills } from "@/hooks/useSkills"
import type { Skill as ManagedSkill } from "@/lib/types"

import {
    SiReact,
    SiNextdotjs,
    SiTailwindcss,
    SiTypescript,
    SiJavascript,
    SiNodedotjs,
    SiMongodb,
    SiPostgresql,
    SiDocker,
    SiRedis,
    SiPython,
    SiGraphql
} from "react-icons/si"


type Category = "frontend" | "backend" | "devops" | "languages"|"tools"


/* ------------------------------------------------ */
/* TECH ICON MAP */
/* ------------------------------------------------ */

const TECH_STACK = {

    react: { icon: SiReact, color: "#61DAFB" },
    nextjs: { icon: SiNextdotjs, color: "#111827" },
    tailwind: { icon: SiTailwindcss, color: "#38BDF8" },
    typescript: { icon: SiTypescript, color: "#3178C6" },
    javascript: { icon: SiJavascript, color: "#F7DF1E" },
    nodejs: { icon: SiNodedotjs, color: "#68A063" },
    mongodb: { icon: SiMongodb, color: "#47A248" },
    postgresql: { icon: SiPostgresql, color: "#336791" },
    docker: { icon: SiDocker, color: "#2496ED" },
    redis: { icon: SiRedis, color: "#DC382D" },
    python: { icon: SiPython, color: "#3776AB" },
    graphql: { icon: SiGraphql, color: "#E10098" }

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
    py: "python",
    gql: "graphql"
}

function resolveTechKey(skill: ManagedSkill) {
    const rawKey = (skill.icon || skill.name).toLowerCase().replace(/[^a-z0-9]/g, "")
    return TECH_ALIASES[rawKey] || (rawKey as keyof typeof TECH_STACK)
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
    const Icon = tech?.icon
    const fallbackLabel = skill.name.trim().slice(0, 2).toUpperCase()

    const angle = (index / total) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    return (

        <div
            className="absolute group cursor-pointer"
            style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%,-50%)"
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

                    {Icon && (

                        <Icon
                            className="
w-5 h-5
md:w-6 md:h-6
lg:w-7 lg:h-7
"
                            style={{ color: tech.color }}
                        />

                    )}

                    {!Icon ? (
                        <span className="text-[10px] md:text-xs lg:text-sm font-semibold text-primary">
                            {fallbackLabel}
                        </span>
                    ) : null}

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

                        Skills & <span className="text-accent">Technologies</span>

                    </h2>

                </div>


                {/* ORBITAL SYSTEM */}

                <div className="flex justify-center relative mb-20">

                    {hasOrbitalSkills ? (
                    <div className="
relative
w-[320px] h-[320px]
md:w-[520px] md:h-[520px]
lg:w-[700px] lg:h-[700px]
">

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

                        <div className="
absolute
w-[280px] h-[280px]
border border-dashed border-blue-400/30
rounded-full
left-1/2 top-1/2
-translate-x-1/2 -translate-y-1/2
"/>

                        <div className="
hidden md:block
absolute
w-[420px] h-[420px]
border border-dashed border-green-400/30
rounded-full
left-1/2 top-1/2
-translate-x-1/2 -translate-y-1/2
"/>

                        <div className="
hidden lg:block
absolute
w-[560px] h-[560px]
border border-dashed border-purple-400/30
rounded-full
left-1/2 top-1/2
-translate-x-1/2 -translate-y-1/2
"/>

                        <div className="
hidden lg:block
absolute
w-[700px] h-[700px]
border border-dashed border-yellow-400/30
rounded-full
left-1/2 top-1/2
-translate-x-1/2 -translate-y-1/2
"/>


                        {/* ORBITS */}

                        <OrbitLayer skills={frontend} {...ORBIT_CONFIG.frontend} />

                        <div className="hidden md:block">
                            <OrbitLayer skills={backend} {...ORBIT_CONFIG.backend} />
                        </div>

                        <div className="hidden lg:block">
                            <OrbitLayer skills={devops} {...ORBIT_CONFIG.devops} />
                            <OrbitLayer skills={languages} {...ORBIT_CONFIG.languages} />
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

            </div>

        </section>

    )

}
