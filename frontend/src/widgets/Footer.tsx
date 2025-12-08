import { Link } from 'react-router-dom'
import {  Github, Linkedin, Twitter, ArrowRight } from 'lucide-react'

export const Footer = () => {
   

    const footerSections = [
        {
            title: 'Продукт',
            links: [
                { label: 'О курсах', href: '#' },
                { label: 'Цены', href: '#' },
                { label: 'Начать обучение', href: '#' },
                { label: 'Документация', href: '#' },
            ],
        },
        {
            title: 'Компания',
            links: [
                { label: 'О нас', href: '#' },
                { label: 'Блог', href: '#' },
                { label: 'Карьера', href: '#' },
                { label: 'Контакты', href: '#' },
            ],
        },
        {
            title: 'Поддержка',
            links: [
                { label: 'Справка', href: '#' },
                { label: 'FAQ', href: '#' },
                { label: 'Сообщить об ошибке', href: '#' },
                { label: 'Статус', href: '#' },
            ],
        },
        {
            title: 'Правовое',
            links: [
                { label: 'Политика конфиденциальности', href: '#' },
                { label: 'Условия использования', href: '#' },
                { label: 'Политика cookies', href: '#' },
                { label: 'Лицензии', href: '#' },
            ],
        },
    ]

    const socialLinks = [
        { icon: Github, href: '#', label: 'GitHub' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Twitter, href: '#', label: 'Twitter' },
    ]

    return (
        <footer
            style={{
                backgroundColor: 'var(--bg-primary)',
                borderTopColor: 'var(--color-primary-400)',
                borderTopWidth: '2px',
            }}
        >
            <div className="container mx-auto px-4 py-12 md:py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="col-span-2 md:col-span-1">
                        <Link
                            to="/"
                            className="flex items-center gap-2 mb-4 hover:scale-105 transition-transform"
                        >
                            <div
                                className="rounded-lg p-2 shadow-lg"
                                style={{
                                    backgroundImage:
                                        'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-400) 50%, var(--color-secondary-500) 100%)',
                                }}
                            >
                                
                            </div>
                            <span
                                className="font-black text-lg"
                                style={{
                                    backgroundImage:
                                        'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-400) 50%, var(--color-secondary-500) 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Школа шведского языка
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            Платформа для изучения шведского языка с
                            интерактивными курсами и личным наставником.
                        </p>
                        <div className="flex gap-2">
                            {socialLinks.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-secondary-100 text-secondary-600 hover:bg-gradient-primary hover:text-white hover:shadow-lg transition-all"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer Sections */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-semibold text-foreground mb-4 text-sm">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                                        >
                                            {link.label}
                                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Contact Info */}
                <div className="grid md:grid-cols-3 gap-6 mb-12 pb-12 border-b border-border"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground text-center md:text-left">
                        © School Swedish. Все права защищены.
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="#"
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Политика конфиденциальности
                        </a>
                        <div className="w-1 h-1 bg-border rounded-full"></div>
                        <a
                            href="#"
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Условия использования
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
