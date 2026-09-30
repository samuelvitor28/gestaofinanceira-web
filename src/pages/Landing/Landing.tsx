import { Link } from "react-router-dom"
import {
  LayoutDashboard,
  PiggyBank,
  ShieldCheck,
  Tags,
  TrendingUp,
  Wallet,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import "./Landing.css"

const features = [
  {
    icon: Wallet,
    title: "Organize suas contas",
    description:
      "Cadastre as origens do seu dinheiro (Nubank, carteira, conta salário) e associe cada transação a elas.",
  },
  {
    icon: Tags,
    title: "Categorize transações",
    description:
      "Classifique receitas e despesas por categoria para entender para onde o seu dinheiro está indo.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard completo",
    description:
      "Veja saldo total, receitas, despesas e últimas movimentações em um só lugar, sem planilhas.",
  },
  {
    icon: TrendingUp,
    title: "Evolução financeira",
    description:
      "Acompanhe como suas finanças evoluem mês a mês e identifique padrões de gastos.",
  },
]

const benefits = [
  {
    icon: PiggyBank,
    title: "Controle real do orçamento",
    description: "Saiba exatamente quanto entra e quanto sai, sem depender da memória.",
  },
  {
    icon: ShieldCheck,
    title: "Só o que importa",
    description:
      "Sem dados bancários sensíveis: contas são apenas organização, não cartões ou senhas.",
  },
  {
    icon: TrendingUp,
    title: "Decisões melhores",
    description: "Visualize hábitos financeiros e tome decisões mais conscientes.",
  },
]

export function Landing() {
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero__glow" aria-hidden />
        <h1 className="landing-hero__title">
          Entenda para onde vai o seu dinheiro <span>sem esforço</span>
        </h1>
        <p className="landing-hero__subtitle">
          Cadastre e controle os seus gastos, ganhos, e investimentos em um só lugar.
        </p>
        <div className="landing-hero__actions">
          <Button size="lg" asChild>
            <Link to="/cadastro">
              Começar agora
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/login">Já tenho conta</Link>
          </Button>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section__header">
          <p className="landing-section__eyebrow">O problema</p>
          <h2 className="landing-section__title">
            Planilhas soltas e extratos espalhados não contam a história completa
          </h2>
          <p className="landing-section__description">
            É difícil saber se você está gastando mais do que ganha quando as
            informações estão espalhadas entre bancos, carteiras e anotações
            soltas. O Gestão Financeira centraliza tudo isso.
          </p>
        </div>

        <div className="landing-features">
          {features.map((feature) => (
            <div className="landing-feature-card" key={feature.title}>
              <span className="landing-feature-card__icon">
                <feature.icon className="size-5" aria-hidden />
              </span>
              <p className="landing-feature-card__title">{feature.title}</p>
              <p className="landing-feature-card__description">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section__header">
          <p className="landing-section__eyebrow">Benefícios</p>
          <h2 className="landing-section__title">
            Feito para quem quer clareza, não complexidade
          </h2>
        </div>

        <div className="landing-benefits">
          {benefits.map((benefit) => (
            <div className="landing-benefit" key={benefit.title}>
              <benefit.icon className="landing-benefit__icon size-5" aria-hidden />
              <div>
                <p className="landing-benefit__title">{benefit.title}</p>
                <p className="landing-benefit__description">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-cta">
          <h2 className="landing-cta__title">
            Pronto para organizar suas finanças?
          </h2>
          <p className="landing-cta__description">
            Crie sua conta gratuitamente e comece a registrar suas transações
            hoje mesmo.
          </p>
          <Button size="lg" asChild>
            <Link to="/cadastro">
              Criar minha conta
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}