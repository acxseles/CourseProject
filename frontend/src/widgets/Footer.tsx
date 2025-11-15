import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui'
import {
  BookOpen,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  ArrowRight
} from 'lucide-react'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

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
    <footer style={{backgroundColor: 'var(--bg-primary)', borderTopColor: 'var(--color-primary-400)', borderTopWidth: '2px'}}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 hover:scale-105 transition-transform">
              <div className="rounded-lg p-2 shadow-lg" style={{backgroundImage: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-400) 50%, var(--color-secondary-500) 100%)'}}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-lg" style={{backgroundImage: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-400) 50%, var(--color-secondary-500) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>School Swedish</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Платформа для изучения шведского языка с интерактивными курсами и личным наставником.
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
              <h3 className="font-semibold text-foreground mb-4 text-sm">{section.title}</h3>
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

        {/* CTA Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 p-6 rounded-xl shadow-lg" style={{backgroundImage: 'linear-gradient(to right, var(--color-primary-50), var(--color-accent-50), var(--color-secondary-50))', borderColor: 'var(--color-primary-200)', borderWidth: '2px'}}>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Начните учиться бесплатно</h3>
            <p className="text-sm text-foreground/70">
              Получите доступ к первому уроку без регистрации. Никаких кредитных карт не требуется.
            </p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Link
              to="/auth/register"
              className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm gap-2 group"
            >
              Начать сейчас
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 pb-12 border-b border-border">
          <div className="flex gap-3">
            <Mail className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-foreground/60">Email</p>
              <a href="mailto:support@schoolswedish.com" className="text-sm text-foreground hover:text-primary-600 transition-colors">
                support@schoolswedish.com
              </a>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-foreground/60">Местоположение</p>
              <p className="text-sm text-foreground">Stockholm, Sweden</p>
            </div>
          </div>
          <div className="flex gap-3">
            <BookOpen className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-foreground/60">Статус</p>
              <div className="flex gap-2">
                <Badge variant="default" className="text-xs bg-green-100 text-green-700">Активно</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            © {currentYear} School Swedish. Все права защищены.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Политика конфиденциальности
            </a>
            <div className="w-1 h-1 bg-border rounded-full"></div>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
