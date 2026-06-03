import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { ArrowRight, BadgePercent, Calculator, Clipboard, Package, RefreshCw, Share2, Sparkles, TrendingUp, Utensils } from 'lucide-react';
import './styles.css';

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 2,
});

const numberFields = {
  productCost: '',
  packagingCost: '',
  waste: '5',
  commission: '25',
  margin: '30',
};

const salonFields = {
  salonPrice: '',
  commission: '25',
  packaging: '',
  promotions: '0',
  margin: '30',
};

const comboFields = {
  currentPrice: '',
  packaging: '',
  discount: '10',
  margin: '30',
};

const defaultComboProducts = [
  { id: 1, name: '', cost: '' },
  { id: 2, name: '', cost: '' },
  { id: 3, name: '', cost: '' },
];

const pageMeta = {
  '/': {
    title: 'Herramientas gratuitas para gastronomía Argentina | GastroCalc',
    description:
      'Calculadoras gratuitas de food cost, comisión delivery y combos para restaurantes, cafeterías y dark kitchens de Argentina.',
    keywords:
      'calculadora gastronómica, food cost, margen gastronómico, calcular precio delivery, calculadora combos gastronómicos, rentabilidad gastronomía',
  },
  '/calculadora-precio-delivery': {
    title: 'Calculadora de Comisión Rappi y PedidosYa Argentina | GastroCalc',
    description:
      'Calculá cuánto te cobra Rappi o PedidosYa por cada pedido y cuál debería ser tu precio en la app para no perder margen.',
    keywords:
      'calculadora delivery, calculadora gastronómica, food cost, margen gastronómico, calcular precio delivery, comisión PedidosYa, calcular precio restaurante, rentabilidad gastronomía, calculadora food cost argentina',
  },
  '/calculadora-comision-delivery': {
    title: 'Calculadora de Comisión Rappi y PedidosYa Argentina | GastroCalc',
    description:
      'Calculá cuánto te cobra Rappi o PedidosYa por cada pedido y cuál debería ser tu precio en la app para no perder margen.',
    keywords:
      'calculadora delivery, calculadora gastronómica, food cost, margen gastronómico, calcular precio delivery, comisión PedidosYa, calcular precio restaurante, rentabilidad gastronomía, calculadora food cost argentina',
  },
  '/simulador-delivery-vs-salon': {
    title: 'Simulador Delivery vs Salón Argentina | GastroCalc',
    description:
      'Compará tu precio de salón con el precio necesario en apps de delivery para mantener el mismo margen de ganancia.',
    keywords:
      'simulador delivery vs salón, precio delivery restaurante, margen delivery, comisión app delivery, rentabilidad gastronomía',
  },
  '/calculadora-combos-gastronomicos': {
    title: 'Calculadora de Combos Gastronómicos Argentina | GastroCalc',
    description:
      'Calculá si tu combo o promoción sigue siendo rentable después de sumar costos, packaging y descuentos.',
    keywords:
      'calculadora combos gastronómicos, calcular precio combo, rentabilidad combo restaurante, promo gastronómica rentable, precio menú ejecutivo, margen combo hamburguesería, calcular promociones gastronomía',
  },
};

const faqItems = [
  {
    question: '¿Cómo calcular el precio de delivery?',
    answer:
      'Para calcular un precio de delivery conviene partir del costo del producto, sumar packaging y merma, definir un margen deseado y luego contemplar la comisión estimada de la plataforma. El objetivo es estimar cuánto debería pagar el cliente para que el negocio conserve rentabilidad después de la comisión.',
  },
  {
    question: '¿Qué porcentaje cobra PedidosYa?',
    answer:
      'El porcentaje puede variar según contrato, tipo de logística, promociones, zona y condiciones comerciales. GastroCalc no usa ni afirma comisiones oficiales: permite cargar una comisión estimada para simular escenarios de precio en gastronomía argentina.',
  },
  {
    question: '¿Qué es la merma en gastronomía?',
    answer:
      'La merma es la pérdida de producto que ocurre por preparación, manipulación, cocción, porcionado, desperdicio o productos que no llegan a venderse. Considerarla ayuda a calcular un costo más realista.',
  },
  {
    question: '¿Cómo calcular food cost?',
    answer:
      'El food cost se calcula comparando el costo de ingredientes de una receta contra su precio de venta. En gastronomía se usa para entender qué porcentaje del precio se consume en materia prima y si el producto deja margen suficiente.',
  },
  {
    question: '¿Cuál es un buen margen gastronómico?',
    answer:
      'No existe un margen único para todos los locales. Depende del rubro, alquiler, personal, impuestos, packaging, canal de venta y volumen. Una cafetería, una hamburguesería y una dark kitchen pueden necesitar márgenes diferentes para ser rentables.',
  },
];

const salonFaqItems = [
  {
    question: '¿Por qué delivery necesita otro precio?',
    answer:
      'Porque el canal delivery suele sumar costos que no siempre existen en salón, como packaging, comisiones de plataforma y promociones. Si se usa el mismo precio sin revisar esos impactos, el margen real puede bajar.',
  },
  {
    question: '¿Cómo afectan las comisiones?',
    answer:
      'Las comisiones reducen el neto que recibe el local por cada pedido. El impacto depende del porcentaje estimado, del precio final, de la logística, del contrato y de las promociones activas.',
  },
  {
    question: '¿Qué porcentaje suelen cobrar las apps?',
    answer:
      'No hay un porcentaje único. Las apps de delivery como PedidosYa, Rappi o similares pueden variar sus condiciones según contrato, zona, logística y acciones comerciales. Por eso conviene simular distintos escenarios.',
  },
  {
    question: '¿Cómo mantener margen en delivery?',
    answer:
      'Para mantener margen conviene separar el precio de salón del precio delivery, incluir packaging, estimar comisión y revisar descuentos. También ayuda controlar food cost y actualizar precios cuando cambian los insumos.',
  },
];

const comboFaqItems = [
  {
    question: '¿Cómo saber si un combo es rentable?',
    answer:
      'Un combo es rentable cuando el precio efectivo que cobra el local, después de aplicar descuentos, cubre la suma de costos de productos y packaging y todavía deja el margen deseado.',
  },
  {
    question: '¿Qué costos incluir en un combo gastronómico?',
    answer:
      'Conviene incluir el costo de cada producto del combo, packaging total, descartables, bolsas, servilletas y cualquier extra que se entregue con la promo o menú especial.',
  },
  {
    question: '¿Cómo afecta un descuento al margen?',
    answer:
      'El descuento reduce el ingreso real del combo. Aunque el precio publicado parezca alto, el margen puede caer si el precio con descuento queda demasiado cerca del costo total.',
  },
  {
    question: '¿Conviene hacer combos en delivery?',
    answer:
      'Puede convenir si aumenta el ticket promedio sin destruir margen. En delivery hay que revisar packaging, promociones y comisiones por separado antes de publicar el combo.',
  },
  {
    question: '¿Qué margen debería tener un combo?',
    answer:
      'Depende del rubro, volumen y estrategia comercial. Muchos locales usan combos para rotación o captación, pero igual deberían controlar que el margen no quede demasiado ajustado.',
  },
];

function parseInput(value) {
  if (value === '') return 0;
  const normalized = String(value).replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value) {
  if (!Number.isFinite(value)) return currencyFormatter.format(0);
  return currencyFormatter.format(value);
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return '0%';
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function App() {
  const path = window.location.pathname;
  const route = getRoute(path);
  const meta = pageMeta[path] || pageMeta['/'];
  const origin = window.location.origin;

  return (
    <div className="min-h-screen bg-graphite text-stone-50">
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords || pageMeta['/'].keywords} />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={`${origin}${path}`} />
        <link rel="canonical" href={`${origin}${path}`} />
      </Helmet>
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(209,132,59,0.18),transparent_36%),radial-gradient(circle_at_90%_12%,rgba(201,164,106,0.14),transparent_30%),linear-gradient(180deg,#11100e_0%,#19130f_58%,#0f0d0b_100%)]" />
      <SeoSchema path={path} />
      <Header />
      <main>
        {route === 'price-delivery' ? (
          <PriceDeliveryCalculatorPage />
        ) : route === 'delivery-vs-salon' ? (
          <DeliveryVsSalonSimulatorPage />
        ) : route === 'combos' ? (
          <ComboCalculatorPage />
        ) : (
          <HomePage />
        )}
      </main>
      <Footer />
    </div>
  );
}

function getRoute(path) {
  if (path === '/calculadora-precio-delivery' || path === '/calculadora-comision-delivery') {
    return 'price-delivery';
  }

  if (path === '/simulador-delivery-vs-salon') {
    return 'delivery-vs-salon';
  }

  if (path === '/calculadora-combos-gastronomicos') {
    return 'combos';
  }

  return 'home';
}


function SeoSchema({ path }) {
  const origin = typeof window === 'undefined' ? 'https://www.gastrocalc.com.ar' : window.location.origin;
  const activeFaqItems =
    path === '/simulador-delivery-vs-salon'
      ? salonFaqItems
      : path === '/calculadora-combos-gastronomicos'
        ? comboFaqItems
        : faqItems;
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GastroCalc',
    url: origin,
    inLanguage: 'es-AR',
    description:
      'Herramientas gratuitas para gastronomía en Argentina: calculadoras de delivery, food cost, precios, márgenes y rentabilidad.',
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: activeFaqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}

function Header() {
  return (
    <header className="border-b border-white/10 bg-graphite/[0.82] backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <a href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-crema">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-caramel/40 bg-caramel/15 text-caramel">
            <Utensils size={19} />
          </span>
          GastroCalc
        </a>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          <a
            href="/"
            className="rounded-full border border-transparent px-3 py-2 text-sm font-medium text-stone-300 transition hover:border-crema/15 hover:bg-white/5 hover:text-crema"
          >
            Inicio
          </a>
          <a
            href="/calculadora-precio-delivery"
            className="rounded-full border border-crema/15 bg-white/5 px-3 py-2 text-sm font-medium text-crema transition hover:border-caramel/50 hover:bg-caramel/10 sm:px-4"
          >
            Calcular precio
          </a>
          <a
            href="/simulador-delivery-vs-salon"
            className="rounded-full border border-transparent px-3 py-2 text-sm font-medium text-stone-300 transition hover:border-caramel/35 hover:bg-caramel/10 hover:text-crema sm:px-4"
          >
            Salón vs Delivery
          </a>
          <a
            href="/calculadora-combos-gastronomicos"
            className="rounded-full border border-transparent px-3 py-2 text-sm font-medium text-stone-300 transition hover:border-caramel/35 hover:bg-caramel/10 hover:text-crema sm:px-4"
          >
            Combos
          </a>
        </div>
      </nav>
    </header>
  );
}

function HomePage() {
  return (
    <section id="calculadoras" className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
      <div>
        <p className="mb-4 inline-flex rounded-full border border-caramel/30 bg-caramel/10 px-3 py-1 text-sm font-medium text-latte">
          GastroCalc
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-crema sm:text-5xl lg:text-6xl">
          Herramientas gratuitas para gastronomía
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
          Calculadoras simples para estimar costos, márgenes, comisiones y precios de venta en cafeterías,
          restaurantes, hamburgueserías y dark kitchens de Argentina.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
      <article className="group rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-glow backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-caramel/35 hover:bg-white/[0.08] sm:p-7">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-caramel text-graphite shadow-[0_16px_50px_rgba(209,132,59,0.25)]">
          <Calculator size={24} />
        </div>
        <h2 className="text-2xl font-semibold text-crema">Calculadora de comisión delivery</h2>
        <p className="mt-3 text-sm leading-6 text-stone-300">
          Simulá cuánto deberías cobrar para sostener margen cuando vendés por apps de delivery.
        </p>
        <a
          href="/calculadora-precio-delivery"
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-caramel px-5 py-3 text-sm font-semibold text-graphite shadow-[0_16px_44px_rgba(209,132,59,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-latte hover:shadow-[0_20px_60px_rgba(209,132,59,0.32)] sm:w-auto"
        >
          Usar calculadora
          <ArrowRight size={18} />
        </a>
      </article>
      <article className="group rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-glow backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-caramel/35 hover:bg-white/[0.08] sm:p-7">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-latte text-graphite shadow-[0_16px_50px_rgba(201,164,106,0.22)]">
          <TrendingUp size={24} />
        </div>
        <h2 className="text-2xl font-semibold text-crema">Simulador Delivery vs Salón</h2>
        <p className="mt-3 text-sm leading-6 text-stone-300">
          Compará tu precio de salón con el precio delivery necesario para sostener margen.
        </p>
        <a
          href="/simulador-delivery-vs-salon"
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-caramel px-5 py-3 text-sm font-semibold text-graphite shadow-[0_16px_44px_rgba(209,132,59,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-latte hover:shadow-[0_20px_60px_rgba(209,132,59,0.32)] sm:w-auto"
        >
          Usar simulador
          <ArrowRight size={18} />
        </a>
      </article>
      <article className="group rounded-[28px] border border-latte/20 bg-gradient-to-br from-latte/12 via-white/[0.06] to-caramel/10 p-5 shadow-glow backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-latte/40 hover:bg-white/[0.08] sm:p-7 lg:col-span-2">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-crema text-graphite shadow-[0_16px_50px_rgba(241,223,195,0.16)]">
          <BadgePercent size={24} />
        </div>
        <h2 className="text-2xl font-semibold text-crema">Calculadora de Combos Gastronómicos</h2>
        <p className="mt-3 text-sm leading-6 text-stone-300">
          Calculá si una promo, combo o menú especial mantiene margen real después de costos, packaging y descuentos.
        </p>
        <a
          href="/calculadora-combos-gastronomicos"
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-caramel px-5 py-3 text-sm font-semibold text-graphite shadow-[0_16px_44px_rgba(209,132,59,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-latte hover:shadow-[0_20px_60px_rgba(209,132,59,0.32)] sm:w-auto"
        >
          Calcular combos
          <ArrowRight size={18} />
        </a>
      </article>
      </div>
    </section>
  );
}

function PriceDeliveryCalculatorPage() {
  const [productName, setProductName] = useState('');
  const [values, setValues] = useState(numberFields);
  const [copied, setCopied] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  const calculation = useMemo(() => {
    const productCost = parseInput(values.productCost);
    const packagingCost = parseInput(values.packagingCost);
    const waste = parseInput(values.waste);
    const commission = parseInput(values.commission);
    const margin = parseInput(values.margin);
    const hasInvalidPercent = commission >= 100 || margin >= 100;

    if (hasInvalidPercent) {
      return { hasInvalidPercent, productCost, packagingCost, waste, commission, margin };
    }

    const baseCost = productCost + packagingCost;
    const costWithWaste = baseCost * (1 + waste / 100);
    const priceWithoutCommission = costWithWaste / (1 - margin / 100);
    const recommendedPrice = priceWithoutCommission / (1 - commission / 100);
    const estimatedProfit = recommendedPrice - costWithWaste;
    const commissionAmount = recommendedPrice * (commission / 100);
    const netAfterCommission = recommendedPrice - commissionAmount;

    return {
      hasInvalidPercent,
      baseCost,
      costWithWaste,
      priceWithoutCommission,
      recommendedPrice,
      estimatedProfit,
      commissionAmount,
      netAfterCommission,
    };
  }, [values]);

  function updateValue(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function clearForm() {
    setProductName('');
    setValues(numberFields);
    setCopied(false);
    setShowShareCard(false);
  }

  async function copyResult() {
    const name = productName.trim() || 'Producto';
    const text = [
      `GastroCalc - ${name}`,
      `Precio sugerido: ${formatCurrency(calculation.recommendedPrice)}`,
      `Costo real estimado: ${formatCurrency(calculation.costWithWaste)}`,
      `Comisión estimada: ${formatCurrency(calculation.commissionAmount)}`,
      `Neto después de comisión: ${formatCurrency(calculation.netAfterCommission)}`,
      `Ganancia estimada por unidad: ${formatCurrency(calculation.estimatedProfit)}`,
    ].join('\n');

    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function shareResult() {
    setShowShareCard(true);

    if (calculation.hasInvalidPercent) return;

    const name = productName.trim() || 'Producto';
    const text = [
      `GastroCalc - ${name}`,
      `Precio sugerido: ${formatCurrency(calculation.recommendedPrice)}`,
      `Comisión estimada: ${formatCurrency(calculation.commissionAmount)}`,
      `Ganancia estimada: ${formatCurrency(calculation.estimatedProfit)}`,
    ].join('\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Resultado GastroCalc - ${name}`,
          text,
        });
      } catch {
        // The visual card remains visible if the native share sheet is dismissed.
      }
    }
  }

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
        <div className="relative mb-7 overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-white/[0.065] via-black/18 to-caramel/8 px-4 py-6 shadow-glow backdrop-blur sm:px-7 sm:py-8">
          <div className="pointer-events-none absolute left-5 top-2 h-32 w-32 rounded-full bg-latte/12 blur-3xl sm:left-16 sm:h-44 sm:w-44" />
          <div className="relative max-w-4xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-caramel/30 bg-caramel/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-latte">
              <Calculator size={14} />
              Calculadora de costos gastronómicos
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight text-crema sm:text-5xl lg:text-6xl">
              Calculá cuánto cobrar
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
              Definí un precio rentable considerando costos, packaging, merma y comisión delivery.
            </p>
            <div className="mt-5 grid max-w-2xl gap-2 text-xs font-semibold text-stone-300 sm:grid-cols-3 sm:text-sm">
              <span className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-center">Costo real</span>
              <span className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-center">Comisión</span>
              <span className="rounded-2xl border border-caramel/25 bg-caramel/10 px-3 py-2 text-center text-latte">Precio sugerido</span>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_0.92fr] lg:items-start">
          <section className="rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-glow transition duration-300 hover:border-white/15 hover:bg-white/[0.07] sm:p-6">
            <div className="grid gap-4">
              <TextInput label="Nombre del producto" value={productName} onChange={setProductName} placeholder="Ej: Hamburguesa clásica" />
              <MoneyInput label="Costo del producto / ingredientes" value={values.productCost} onChange={(value) => updateValue('productCost', value)} />
              <MoneyInput label="Costo de packaging" value={values.packagingCost} onChange={(value) => updateValue('packagingCost', value)} />
              <PercentInput
                label="Merma / desperdicio"
                value={values.waste}
                onChange={(value) => updateValue('waste', value)}
                helper="Estimación promedio de pérdida de producto. Baja: 3%, media: 5%, alta: 10%."
                presets={[
                  ['3', '3% baja'],
                  ['5', '5% media'],
                  ['10', '10% alta'],
                ]}
              />
              <PercentInput
                label="Comisión de plataforma delivery"
                value={values.commission}
                onChange={(value) => updateValue('commission', value)}
                helper="La comisión puede variar según plataforma, contrato, logística, promociones y zona. Usá este campo como estimación."
                presets={[
                  ['15', '15% baja'],
                  ['25', '25% media'],
                  ['35', '35% alta'],
                ]}
              />
              <PercentInput
                label="Margen de ganancia deseado"
                value={values.margin}
                onChange={(value) => updateValue('margin', value)}
              />
            </div>
          </section>

          <aside className="rounded-[30px] border border-caramel/30 bg-gradient-to-br from-caramel/20 via-white/[0.075] to-cocoa/18 p-4 shadow-glow transition duration-300 hover:border-caramel/45 sm:p-6 lg:sticky lg:top-5">
            {calculation.hasInvalidPercent ? (
              <div className="rounded-2xl border border-red-300/30 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
                La comisión y el margen deseado deben ser menores al 100% para poder calcular un precio sugerido.
              </div>
            ) : (
              <Results calculation={calculation} productName={productName} />
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <button
                type="button"
                onClick={clearForm}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-crema/10 bg-black/20 px-4 py-3 text-sm font-semibold text-stone-300 transition duration-300 hover:border-crema/20 hover:bg-white/[0.06] hover:text-crema"
              >
                <RefreshCw size={17} />
                Limpiar
              </button>
              <button
                type="button"
                onClick={shareResult}
                disabled={calculation.hasInvalidPercent}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-caramel/35 bg-caramel/[0.12] px-4 py-3 text-sm font-semibold text-latte shadow-[0_10px_34px_rgba(209,132,59,0.12)] transition duration-300 hover:-translate-y-0.5 hover:border-caramel/65 hover:bg-caramel/20 hover:text-crema disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Share2 size={17} />
                Compartir resultado
              </button>
              <button
                type="button"
                onClick={copyResult}
                disabled={calculation.hasInvalidPercent}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#e09a4f] to-caramel px-4 py-3 text-sm font-semibold text-graphite shadow-[0_12px_30px_rgba(209,132,59,0.24),inset_0_1px_0_rgba(255,255,255,0.24)] transition duration-300 ease-out hover:-translate-y-1 hover:from-[#e6a660] hover:to-[#d98b43] hover:shadow-[0_18px_44px_rgba(209,132,59,0.32),0_0_20px_rgba(209,132,59,0.12),inset_0_1px_0_rgba(255,255,255,0.28)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Clipboard size={17} />
                {copied ? 'Copiado' : 'Copiar resultado'}
              </button>
            </div>

            {showShareCard && !calculation.hasInvalidPercent ? (
              <ShareCard calculation={calculation} productName={productName} />
            ) : null}
          </aside>
        </div>
      </section>

      <PriceDeliverySeoPrimary />
      <UpcomingTools />
      <SeoContent />
      <FaqSection />
    </>
  );
}

function DeliveryVsSalonSimulatorPage() {
  const [productName, setProductName] = useState('');
  const [values, setValues] = useState(salonFields);
  const [copied, setCopied] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  const calculation = useMemo(() => {
    const salonPrice = parseInput(values.salonPrice);
    const commission = parseInput(values.commission);
    const packaging = parseInput(values.packaging);
    const promotions = parseInput(values.promotions);
    const margin = parseInput(values.margin);
    const hasInvalidPercent = commission >= 100 || promotions >= 100 || margin >= 100;

    if (hasInvalidPercent) {
      return { hasInvalidPercent, salonPrice, commission, packaging, promotions, margin };
    }

    const salonProfit = salonPrice * (margin / 100);
    const estimatedBaseCost = Math.max(salonPrice - salonProfit, 0);
    const deliveryFactor = (1 - promotions / 100) * (1 - commission / 100);
    const deliveryPrice = deliveryFactor > 0 ? (estimatedBaseCost + packaging) / ((1 - margin / 100) * deliveryFactor) : 0;
    const promotionImpact = deliveryPrice * (promotions / 100);
    const priceAfterPromotion = deliveryPrice - promotionImpact;
    const commissionAmount = priceAfterPromotion * (commission / 100);
    const approximateNet = priceAfterPromotion - commissionAmount - packaging;
    const difference = deliveryPrice - salonPrice;
    const differencePercent = salonPrice > 0 ? (difference / salonPrice) * 100 : 0;

    return {
      hasInvalidPercent,
      salonPrice,
      commission,
      packaging,
      promotions,
      margin,
      salonProfit,
      estimatedBaseCost,
      deliveryPrice,
      promotionImpact,
      commissionAmount,
      approximateNet,
      difference,
      differencePercent,
    };
  }, [values]);

  function updateValue(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function clearForm() {
    setProductName('');
    setValues(salonFields);
    setCopied(false);
    setShowShareCard(false);
  }

  async function copyResult() {
    const name = productName.trim() || 'Producto';
    const text = [
      `GastroCalc - Delivery vs Salón - ${name}`,
      `Salón: ${formatCurrency(calculation.salonPrice)}`,
      `Precio sugerido delivery: ${formatCurrency(calculation.deliveryPrice)}`,
      `Diferencia vs salón: ${formatCurrency(calculation.difference)} (${formatPercent(calculation.differencePercent)})`,
      `Comisión estimada: ${formatCurrency(calculation.commissionAmount)}`,
      `Impacto promociones: ${formatCurrency(calculation.promotionImpact)}`,
      `Neto aproximado: ${formatCurrency(calculation.approximateNet)}`,
    ].join('\n');

    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function shareResult() {
    setShowShareCard(true);

    if (calculation.hasInvalidPercent) return;

    const name = productName.trim() || 'Producto';
    const text = [
      `GastroCalc - Delivery vs Salón - ${name}`,
      `Salón: ${formatCurrency(calculation.salonPrice)}`,
      `Delivery sugerido: ${formatCurrency(calculation.deliveryPrice)}`,
      `Diferencia: ${formatPercent(calculation.differencePercent)}`,
    ].join('\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Delivery vs Salón - ${name}`,
          text,
        });
      } catch {
        // The visual card remains visible if the native share sheet is dismissed.
      }
    }
  }

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
        <DiagnosticHero />

        <div className="grid gap-5 lg:grid-cols-[1fr_0.92fr] lg:items-start">
          <section className="rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-glow transition duration-300 hover:border-white/15 hover:bg-white/[0.07] sm:p-6">
            <div className="grid gap-4">
              <TextInput label="Nombre del producto" value={productName} onChange={setProductName} placeholder="Ej: Combo burger" />
              <MoneyInput label="Precio actual en salón" value={values.salonPrice} onChange={(value) => updateValue('salonPrice', value)} />
              <PercentInput
                label="Comisión estimada de la app"
                value={values.commission}
                onChange={(value) => updateValue('commission', value)}
                helper="Usá una estimación según tu contrato, logística, zona y condiciones comerciales."
                presets={[
                  ['15', '15%'],
                  ['25', '25%'],
                  ['35', '35%'],
                ]}
              />
              <MoneyInput label="Packaging" value={values.packaging} onChange={(value) => updateValue('packaging', value)} />
              <PercentInput
                label="Descuento o promo aplicada"
                value={values.promotions}
                onChange={(value) => updateValue('promotions', value)}
                helper="Estimá descuentos o promociones que puedan reducir el ingreso neto por pedido."
                presets={[
                  ['0', '0%'],
                  ['10', '10%'],
                  ['20', '20%'],
                ]}
              />
              <PercentInput
                label="Margen que querés conservar"
                value={values.margin}
                onChange={(value) => updateValue('margin', value)}
                helper="Se usa para estimar la ganancia actual de referencia en salón."
              />
            </div>
          </section>

          <aside className="rounded-[30px] border border-caramel/30 bg-gradient-to-br from-caramel/20 via-white/[0.075] to-cocoa/18 p-4 shadow-glow transition duration-300 hover:border-caramel/45 sm:p-6 lg:sticky lg:top-5">
            {calculation.hasInvalidPercent ? (
              <div className="rounded-2xl border border-red-300/30 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
                Comisión, promociones y margen deben ser menores al 100% para calcular un precio delivery.
              </div>
            ) : (
              <DeliveryVsSalonResults calculation={calculation} productName={productName} />
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <button
                type="button"
                onClick={clearForm}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-crema/10 bg-black/20 px-4 py-3 text-sm font-semibold text-stone-300 transition duration-300 hover:border-crema/20 hover:bg-white/[0.06] hover:text-crema"
              >
                <RefreshCw size={17} />
                Limpiar
              </button>
              <button
                type="button"
                onClick={shareResult}
                disabled={calculation.hasInvalidPercent}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-caramel/35 bg-caramel/[0.12] px-4 py-3 text-sm font-semibold text-latte shadow-[0_10px_34px_rgba(209,132,59,0.12)] transition duration-300 hover:-translate-y-0.5 hover:border-caramel/65 hover:bg-caramel/20 hover:text-crema disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Share2 size={17} />
                Compartir
              </button>
              <button
                type="button"
                onClick={copyResult}
                disabled={calculation.hasInvalidPercent}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#e09a4f] to-caramel px-4 py-3 text-sm font-semibold text-graphite shadow-[0_12px_30px_rgba(209,132,59,0.24),inset_0_1px_0_rgba(255,255,255,0.24)] transition duration-300 ease-out hover:-translate-y-1 hover:from-[#e6a660] hover:to-[#d98b43] hover:shadow-[0_18px_44px_rgba(209,132,59,0.32),0_0_20px_rgba(209,132,59,0.12),inset_0_1px_0_rgba(255,255,255,0.28)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Clipboard size={17} />
                {copied ? 'Copiado' : 'Copiar resultado'}
              </button>
            </div>

            {showShareCard && !calculation.hasInvalidPercent ? (
              <DeliveryVsSalonShareCard calculation={calculation} productName={productName} />
            ) : null}
          </aside>
        </div>
      </section>

      <DeliveryVsSalonSeoPrimary />
      <ToolInterlinking />
      <SalonSeoContent />
      <SalonFaqSection />
    </>
  );
}

function ComboCalculatorPage() {
  const [comboName, setComboName] = useState('');
  const [values, setValues] = useState(comboFields);
  const [products, setProducts] = useState(defaultComboProducts);
  const [copied, setCopied] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  const calculation = useMemo(() => {
    const currentPrice = parseInput(values.currentPrice);
    const productCosts = products.map((product) => parseInput(product.cost));
    const packaging = parseInput(values.packaging);
    const discount = parseInput(values.discount);
    const margin = parseInput(values.margin);
    const hasCurrentPrice = values.currentPrice !== '';
    const hasInvalidPercent = margin >= 100;

    if (hasInvalidPercent) {
      return { hasInvalidPercent, currentPrice, packaging, discount, margin, hasCurrentPrice };
    }

    const costoProductos = productCosts.reduce((total, value) => total + value, 0);
    const costoTotal = costoProductos + packaging;
    const precioSugerido = costoTotal / (1 - margin / 100);
    const precioConDescuento = hasCurrentPrice ? currentPrice * (1 - discount / 100) : 0;
    const gananciaActual = hasCurrentPrice ? precioConDescuento - costoTotal : 0;
    const margenActual = hasCurrentPrice && precioConDescuento > 0 ? (gananciaActual / precioConDescuento) * 100 : 0;
    const diferencia = precioSugerido - precioConDescuento;

    return {
      hasInvalidPercent,
      hasCurrentPrice,
      currentPrice,
      costoProductos,
      costoTotal,
      precioSugerido,
      precioConDescuento,
      gananciaActual,
      margenActual,
      diferencia,
      packaging,
      discount,
      margin,
    };
  }, [products, values]);

  function updateValue(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function updateProduct(productId, field, value) {
    setProducts((current) =>
      current.map((product) => (product.id === productId ? { ...product, [field]: value } : product)),
    );
  }

  function addProduct() {
    setProducts((current) => {
      const nextId = current.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1;
      return [...current, { id: nextId, name: '', cost: '' }];
    });
  }

  function removeProduct(productId) {
    setProducts((current) => (current.length > 1 ? current.filter((product) => product.id !== productId) : current));
  }

  function clearForm() {
    setComboName('');
    setValues(comboFields);
    setProducts(defaultComboProducts);
    setCopied(false);
    setShowShareCard(false);
  }

  async function copyResult() {
    const name = comboName.trim() || 'Combo';
    const text = [
      `GastroCalc - Combos - ${name}`,
      `Precio sugerido del combo: ${formatCurrency(calculation.precioSugerido)}`,
      `Costo total del combo: ${formatCurrency(calculation.costoTotal)}`,
      `Precio actual con descuento: ${calculation.hasCurrentPrice ? formatCurrency(calculation.precioConDescuento) : 'Sin precio actual'}`,
      `Ganancia actual estimada: ${calculation.hasCurrentPrice ? formatCurrency(calculation.gananciaActual) : 'Sin precio actual'}`,
      `Margen actual estimado: ${calculation.hasCurrentPrice ? `${calculation.margenActual.toFixed(1)}%` : 'Sin precio actual'}`,
      `Diagnóstico: ${getComboDiagnosisMessage(calculation)}`,
    ].join('\n');

    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function shareResult() {
    setShowShareCard(true);

    if (calculation.hasInvalidPercent) return;

    const name = comboName.trim() || 'Combo';
    const text = [
      `GastroCalc - ${name}`,
      `Combo sugerido: ${formatCurrency(calculation.precioSugerido)}`,
      `Costo total: ${formatCurrency(calculation.costoTotal)}`,
      `Diagnóstico: ${getComboStatus(calculation).label}`,
    ].join('\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Resultado combo - ${name}`,
          text,
        });
      } catch {
        // The visual card remains visible if the native share sheet is dismissed.
      }
    }
  }

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
        <ComboHero />

        <div className="grid gap-5 lg:grid-cols-[1fr_0.94fr] lg:items-start">
          <section className="rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-glow transition duration-300 hover:border-white/15 hover:bg-white/[0.07] sm:p-6">
            <div className="grid gap-4">
              <TextInput label="Nombre del combo" value={comboName} onChange={setComboName} placeholder="Ej: Burger doble + papas + bebida" />
              <MoneyInput label="Precio actual del combo" value={values.currentPrice} onChange={(value) => updateValue('currentPrice', value)} />

              <div className="rounded-[24px] border border-caramel/20 bg-black/18 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Package size={18} className="text-caramel" />
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-latte">Productos del combo</h2>
                </div>
                <div className="grid max-h-[640px] gap-3 overflow-y-auto pr-1">
                  {products.map((product, index) => (
                    <div key={product.id} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3 transition duration-300 hover:border-caramel/25 hover:bg-white/[0.06]">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-caramel/25 bg-caramel/10 text-xs font-semibold text-latte">
                            {index + 1}
                          </span>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-latte">
                            Ítem del combo
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProduct(product.id)}
                          disabled={products.length === 1}
                          aria-label={`Eliminar ítem ${index + 1}`}
                          className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-stone-300 transition duration-300 hover:border-caramel/35 hover:bg-caramel/10 hover:text-crema disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          Eliminar
                        </button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
                        <TextInput
                          label="Nombre del producto"
                          value={product.name}
                          onChange={(value) => updateProduct(product.id, 'name', value)}
                          placeholder={index === 0 ? 'Ej: Hamburguesa clásica' : 'Ej: Papas, bebida, postre'}
                        />
                        <MoneyInput
                          label="Costo del producto"
                          value={product.cost}
                          onChange={(value) => updateProduct(product.id, 'cost', value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={addProduct}
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-caramel/35 bg-caramel/10 px-4 py-3 text-sm font-semibold text-latte shadow-[0_10px_30px_rgba(209,132,59,0.1)] transition duration-300 hover:-translate-y-0.5 hover:border-caramel/60 hover:bg-caramel/20 hover:text-crema sm:w-auto"
                  >
                    + Agregar producto
                  </button>
                </div>
              </div>

              <MoneyInput label="Packaging total" value={values.packaging} onChange={(value) => updateValue('packaging', value)} />
              <PercentInput
                label="Descuento aplicado"
                value={values.discount}
                onChange={(value) => updateValue('discount', value)}
                helper="Se aplica sobre el precio actual del combo para estimar el ingreso real."
                presets={[
                  ['0', '0%'],
                  ['10', '10%'],
                  ['20', '20%'],
                ]}
              />
              <PercentInput
                label="Margen deseado"
                value={values.margin}
                onChange={(value) => updateValue('margin', value)}
                helper="Debe ser menor al 100% para calcular el precio sugerido."
                presets={[
                  ['25', '25%'],
                  ['30', '30%'],
                  ['40', '40%'],
                ]}
              />
            </div>
          </section>

          <aside className="rounded-[30px] border border-latte/30 bg-gradient-to-br from-latte/18 via-white/[0.075] to-caramel/14 p-4 shadow-glow transition duration-300 hover:border-latte/45 sm:p-6 lg:sticky lg:top-5">
            {calculation.hasInvalidPercent ? (
              <div className="rounded-2xl border border-caramel/35 bg-caramel/10 p-4 text-sm leading-6 text-crema">
                El margen deseado debe ser menor al 100% para calcular el precio sugerido del combo.
              </div>
            ) : (
              <ComboResults calculation={calculation} comboName={comboName} />
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <button
                type="button"
                onClick={clearForm}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-crema/10 bg-black/20 px-4 py-3 text-sm font-semibold text-stone-300 transition duration-300 hover:border-crema/20 hover:bg-white/[0.06] hover:text-crema"
              >
                <RefreshCw size={17} />
                Limpiar
              </button>
              <button
                type="button"
                onClick={shareResult}
                disabled={calculation.hasInvalidPercent}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-caramel/35 bg-caramel/[0.12] px-4 py-3 text-sm font-semibold text-latte shadow-[0_10px_34px_rgba(209,132,59,0.12)] transition duration-300 hover:-translate-y-0.5 hover:border-caramel/65 hover:bg-caramel/20 hover:text-crema disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Share2 size={17} />
                Compartir
              </button>
              <button
                type="button"
                onClick={copyResult}
                disabled={calculation.hasInvalidPercent}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#e09a4f] to-caramel px-4 py-3 text-sm font-semibold text-graphite shadow-[0_12px_30px_rgba(209,132,59,0.24),inset_0_1px_0_rgba(255,255,255,0.24)] transition duration-300 ease-out hover:-translate-y-1 hover:from-[#e6a660] hover:to-[#d98b43] hover:shadow-[0_18px_44px_rgba(209,132,59,0.32),0_0_20px_rgba(209,132,59,0.12),inset_0_1px_0_rgba(255,255,255,0.28)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Clipboard size={17} />
                {copied ? 'Copiado' : 'Copiar resultado'}
              </button>
            </div>

            {showShareCard && !calculation.hasInvalidPercent ? (
              <ComboShareCard calculation={calculation} comboName={comboName} />
            ) : null}
          </aside>
        </div>
      </section>

      <ComboSeoPrimary />
      <ComboToolInterlinking />
      <ComboSeoContent />
      <ComboFaqSection />
    </>
  );
}

function PriceDeliverySeoPrimary() {
  const path = window.location.pathname;
  const isComision = path === '/calculadora-comision-delivery';

  return (
    <section className="mx-auto max-w-4xl px-4 pb-2 pt-8 sm:px-6 sm:pt-12" aria-labelledby="seo-primary-price-delivery">
      <h2 id="seo-primary-price-delivery" className="text-2xl font-semibold tracking-tight text-crema sm:text-3xl">
        {isComision
          ? '¿Cómo calcular la comisión de Rappi y PedidosYa en Argentina?'
          : '¿Cómo fijar el precio de tus platos en apps de delivery?'}
      </h2>
      <div className="mt-5 space-y-4 text-sm leading-7 text-stone-300 sm:text-base">
        {isComision ? (
          <>
            <p>
              La comisión de delivery es el porcentaje que te cobra la plataforma por cada pedido que recibís. Rappi,
              PedidosYa y otras apps trabajan con porcentajes que pueden variar según el contrato, la zona, el tipo
              de logística elegida y las condiciones comerciales vigentes. Entender cuánto te descuenta la app antes
              de que te acrediten el pago es el primer paso para saber si tu precio está bien planteado.
            </p>
            <p>
              El problema de no calcular la comisión delivery antes de publicar precios es que el margen de ganancia
              puede quedar mucho más chico de lo que parece. Si usás el mismo precio que en salón, la plataforma se
              queda con un porcentaje de ese importe y vos recibís menos neto. En muchos casos, ese recorte baja la
              ganancia por debajo del mínimo para cubrir costos de insumos, packaging y operación del local.
            </p>
            <p>
              Con esta calculadora de comisión delivery podés simular distintos escenarios: cargás el costo del
              producto, el packaging, la merma estimada y el porcentaje de comisión que te aplica la app, y ves qué
              precio de venta necesitás para conservar el margen que querés. Es una herramienta especialmente útil
              si estás arrancando o si tenés dudas sobre si la plataforma está siendo rentable para tu restaurante,
              hamburguesería o dark kitchen.
            </p>
          </>
        ) : (
          <>
            <p>
              Fijar el precio de un plato para apps de delivery es diferente a ponerle precio en salón. En delivery
              aparecen costos que muchas veces no se consideran: el packaging (envase, bolsa, sello y descartables),
              la comisión de la plataforma y, en muchos casos, descuentos o promociones que la app puede activar
              sobre tu menú. Si no incorporás estos factores al cálculo, el precio que publicás puede no ser
              suficiente para cubrir tus costos reales.
            </p>
            <p>
              La diferencia entre precio de salón y precio de delivery no es opcional, es necesaria. Un plato que
              deja un 30% de margen en salón puede dejar un 10% o incluso un número negativo en delivery si no
              ajustaste el precio. La comisión y el packaging juntos pueden representar entre un 25% y un 40% del
              valor del pedido, dependiendo de cómo tengas configurado tu contrato con la plataforma.
            </p>
            <p>
              Con la calculadora de precio delivery podés calcular tu precio sugerido partiendo del costo del
              producto, sumando packaging y merma, y ajustando por comisión y margen objetivo. El resultado es una
              estimación de cuánto debería pagar el cliente para que tu negocio sea rentable en el canal app, sin
              necesidad de conocer todos los detalles técnicos del food cost gastronómico.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

function DeliveryVsSalonSeoPrimary() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-2 pt-8 sm:px-6 sm:pt-12" aria-labelledby="seo-primary-salon">
      <h2 id="seo-primary-salon" className="text-2xl font-semibold tracking-tight text-crema sm:text-3xl">
        ¿Tu delivery es realmente rentable?
      </h2>
      <div className="mt-5 space-y-4 text-sm leading-7 text-stone-300 sm:text-base">
        <p>
          Muchos restaurantes y dark kitchens en Argentina venden por delivery sin saber exactamente si están
          ganando o perdiendo plata en ese canal. El motivo es simple: el precio de salón muchas veces se copia
          al menú de la app sin revisar qué impacto tienen la comisión de la plataforma, el packaging y los
          descuentos activos. El resultado es que el margen delivery puede ser mucho más bajo que el margen salón,
          incluso cuando las ventas en la app aumentan.
        </p>
        <p>
          Para comparar correctamente la rentabilidad entre canales hay que partir del precio de salón, estimar el
          costo del packaging y el porcentaje de comisión, y calcular qué precio necesitaría el producto en la app
          para mantener el mismo margen. En muchos casos, la diferencia necesaria está entre un 20% y un 40% por
          encima del precio de salón, lo cual no siempre coincide con lo que el local tiene publicado en Rappi o
          PedidosYa.
        </p>
        <p>
          El simulador delivery vs salón te permite hacer esa comparación rápido: ingresás el precio de salón,
          el packaging estimado, la comisión de la app y las promociones activas, y te muestra cuánto debería
          costar el mismo producto en delivery para que el margen no caiga. Es especialmente útil antes de activar
          una nueva plataforma, actualizar precios o revisar si tu canal delivery está siendo viable como negocio.
        </p>
      </div>
    </section>
  );
}

function ComboSeoPrimary() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-2 pt-8 sm:px-6 sm:pt-12" aria-labelledby="seo-primary-combos">
      <h2 id="seo-primary-combos" className="text-2xl font-semibold tracking-tight text-crema sm:text-3xl">
        ¿Cómo calcular si un combo o promoción es rentable?
      </h2>
      <div className="mt-5 space-y-4 text-sm leading-7 text-stone-300 sm:text-base">
        <p>
          Los combos gastronómicos son una estrategia común para subir el ticket promedio y rotar productos, pero
          tienen un riesgo invisible: cuando se aplica un descuento sobre el precio del combo sin calcular bien los
          costos, el margen real puede bajar mucho más de lo esperado. El precio de lista de un combo no es lo
          mismo que el ingreso neto después del descuento, el packaging y el costo de cada producto incluido.
        </p>
        <p>
          Para saber si un combo es rentable hay que sumar el costo de cada producto, el packaging total y
          cualquier descartable incluido, y comparar ese total con el ingreso real después de aplicar el descuento.
          Si esa diferencia no cubre el margen mínimo que necesita el local para operar, el combo está perdiendo
          rentabilidad aunque se venda bien en volumen. Muchas hamburgueserías, cafeterías y restaurantes cuentan
          unidades vendidas sin darse cuenta de que cada combo les genera pérdida neta.
        </p>
        <p>
          La calculadora de combos gastronómicos te permite simular esa comparación: cargás los productos del
          combo, el packaging, el precio actual y el descuento aplicado, y el sistema calcula si el precio es
          suficiente o si necesitás ajustarlo. También podés calcular el precio mínimo sugerido desde cero,
          fijando el margen que querés conservar, para que el combo funcione como herramienta de ventas sin
          sacrificar la rentabilidad del local.
        </p>
      </div>
    </section>
  );
}

function DiagnosticHero() {
  return (
    <div className="relative mb-7 overflow-hidden rounded-[30px] border border-caramel/25 bg-gradient-to-br from-caramel/18 via-white/[0.05] to-black/25 px-4 py-6 shadow-glow backdrop-blur sm:px-7 sm:py-8">
      <div className="pointer-events-none absolute right-6 top-0 h-36 w-36 rounded-full bg-caramel/22 blur-3xl sm:h-48 sm:w-48" />
      <div className="relative max-w-4xl">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-latte/30 bg-latte/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-latte">
          <TrendingUp size={14} />
          Diagnóstico de rentabilidad
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight text-crema sm:text-5xl lg:text-6xl">
          ¿Tu delivery realmente deja ganancia?
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
          Compará el precio de salón contra el precio necesario en apps para no perder margen.
        </p>
        <div className="mt-5 grid max-w-xl grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl border border-white/10 bg-black/20 p-2 text-xs font-semibold text-stone-300 sm:text-sm">
          <span className="rounded-xl bg-white/[0.055] px-3 py-2 text-center">Salón</span>
          <ArrowRight size={17} className="text-caramel" />
          <span className="rounded-xl bg-caramel/10 px-3 py-2 text-center text-latte">Delivery</span>
        </div>
      </div>
    </div>
  );
}

function ComboHero() {
  return (
    <div className="relative mb-7 overflow-hidden rounded-[30px] border border-latte/24 bg-gradient-to-br from-latte/12 via-white/[0.05] to-caramel/12 px-4 py-6 shadow-glow backdrop-blur sm:px-7 sm:py-8">
      <div className="pointer-events-none absolute right-4 top-2 h-40 w-40 rounded-full bg-caramel/18 blur-3xl sm:h-52 sm:w-52" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-24 w-56 rounded-full bg-latte/12 blur-3xl" />
      <div className="relative max-w-4xl">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-latte/30 bg-latte/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-latte">
          <BadgePercent size={14} />
          Herramienta gratuita para combos y promociones
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight text-crema sm:text-5xl lg:text-6xl">
          ¿Tu combo sigue siendo rentable?
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
          Calculá si una promo, combo o menú especial mantiene margen real después de sumar costos, packaging y descuentos.
        </p>
        <div className="mt-5 grid max-w-xl grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl border border-white/10 bg-black/20 p-2 text-xs font-semibold text-stone-300 sm:text-sm">
          <span className="rounded-xl bg-white/[0.055] px-3 py-2 text-center">Precio actual</span>
          <ArrowRight size={17} className="text-caramel" />
          <span className="rounded-xl bg-caramel/10 px-3 py-2 text-center text-latte">Precio sugerido</span>
        </div>
      </div>
    </div>
  );
}

function ToolHero({ title, subtitle, detail }) {
  return (
    <div className="relative mb-7 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] px-4 py-6 shadow-glow backdrop-blur sm:px-7 sm:py-8">
      <div className="pointer-events-none absolute left-5 top-2 h-32 w-32 rounded-full bg-caramel/20 blur-3xl sm:left-16 sm:h-44 sm:w-44" />
      <div className="relative max-w-4xl">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-caramel/30 bg-caramel/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-latte">
          <Sparkles size={14} />
          Herramienta gratuita para gastronomía
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight text-crema sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">{subtitle}</p>
        <p className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs font-medium text-stone-300 sm:text-sm">
          <TrendingUp size={16} className="text-caramel" />
          {detail}
        </p>
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-crema">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl border border-white/10 bg-[#17120f] px-4 text-base text-stone-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.055),inset_0_-10px_24px_rgba(0,0,0,0.18)] outline-none transition duration-300 placeholder:text-stone-500 hover:border-white/16 hover:bg-[#1b1511] focus:border-caramel focus:bg-[#201814] focus:shadow-[0_0_0_4px_rgba(209,132,59,0.13),inset_0_1px_0_rgba(255,255,255,0.07)] focus:ring-0"
      />
    </label>
  );
}

function MoneyInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-crema">{label}</span>
      <div className="flex h-14 items-center rounded-2xl border border-white/10 bg-[#17120f] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.055),inset_0_-10px_24px_rgba(0,0,0,0.18)] transition duration-300 hover:border-white/16 hover:bg-[#1b1511] focus-within:border-caramel focus-within:bg-[#201814] focus-within:shadow-[0_0_0_4px_rgba(209,132,59,0.13),inset_0_1px_0_rgba(255,255,255,0.07)]">
        <span className="mr-2 text-sm font-semibold text-latte">$</span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-base text-stone-50 outline-none placeholder:text-stone-500"
          placeholder="0"
        />
      </div>
    </label>
  );
}

function PercentInput({ label, value, onChange, helper, presets }) {
  return (
    <div>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-crema">{label}</span>
        <div className="flex h-14 items-center rounded-2xl border border-white/10 bg-[#17120f] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.055),inset_0_-10px_24px_rgba(0,0,0,0.18)] transition duration-300 hover:border-white/16 hover:bg-[#1b1511] focus-within:border-caramel focus-within:bg-[#201814] focus-within:shadow-[0_0_0_4px_rgba(209,132,59,0.13),inset_0_1px_0_rgba(255,255,255,0.07)]">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full bg-transparent text-base text-stone-50 outline-none placeholder:text-stone-500"
            placeholder="0"
          />
          <span className="ml-2 text-sm font-semibold text-latte">%</span>
        </div>
      </label>
      {helper ? <p className="mt-2 text-xs leading-5 text-stone-400">{helper}</p> : null}
      {presets ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {presets.map(([presetValue, labelText]) => (
            <button
              key={presetValue}
              type="button"
              onClick={() => onChange(presetValue)}
              className="rounded-full border border-caramel/25 bg-caramel/10 px-3 py-1.5 text-xs font-semibold text-latte transition duration-300 hover:-translate-y-0.5 hover:border-caramel/60 hover:bg-caramel/20 hover:text-crema"
            >
              {labelText}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Results({ calculation, productName }) {
  const productLabel = productName.trim() || 'Producto';
  const isEmptyResult = calculation.costWithWaste === 0 && calculation.recommendedPrice === 0;
  const rows = [
    ['Costo real estimado', calculation.costWithWaste],
    ['Comisión estimada', calculation.commissionAmount],
    ['Neto después de comisión', calculation.netAfterCommission],
    ['Ganancia estimada por unidad', calculation.estimatedProfit],
  ];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-latte">
        Resultado para: <span className="text-crema">{productLabel}</span>
      </p>
      <div
        className={`mt-4 rounded-[28px] border border-white/10 bg-graphite/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition duration-300 sm:p-6 ${
          isEmptyResult ? 'opacity-75' : 'opacity-100'
        }`}
      >
        <p className="text-sm font-medium text-stone-400">Precio sugerido</p>
        <p className={`mt-2 font-semibold leading-none tracking-tight text-crema ${isEmptyResult ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl'}`}>
          {formatCurrency(calculation.recommendedPrice)}
        </p>
        <p className="mt-3 text-xs font-medium text-latte sm:text-sm">
          Estimación para mantener margen después de comisión delivery.
        </p>
        <p className="mt-4 rounded-2xl border border-caramel/20 bg-caramel/10 p-3 text-sm leading-6 text-stone-200">
          {getInsightMessage(calculation)}
        </p>
      </div>
      <div className="mt-4 grid gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 transition duration-300 hover:border-caramel/25 hover:bg-white/[0.065]">
            <span className="text-sm text-stone-300">{label}</span>
            <strong className="text-right text-sm font-semibold text-crema">{formatCurrency(value)}</strong>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-2xl border border-latte/20 bg-latte/10 p-3 text-xs leading-5 text-stone-300">
        Estos valores son orientativos. Las comisiones reales pueden variar según contrato, plataforma,
        promociones e impuestos.
      </p>
    </div>
  );
}

function DeliveryVsSalonResults({ calculation, productName }) {
  const productLabel = productName.trim() || 'Producto';
  const isEmptyResult = calculation.salonPrice === 0 && calculation.deliveryPrice === 0;
  const highImpact = calculation.differencePercent >= 20;
  const rows = [
    ['Comisión estimada', calculation.commissionAmount],
    ['Impacto promociones', calculation.promotionImpact],
    ['Neto aproximado', calculation.approximateNet],
  ];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-latte">
        Resultado para: <span className="text-crema">{productLabel}</span>
      </p>
      <div
        className={`mt-4 rounded-[28px] border border-white/10 bg-graphite/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition duration-300 sm:p-6 ${
          isEmptyResult ? 'opacity-75' : 'opacity-100'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-stone-400">Comparación de margen</p>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              highImpact
                ? 'border-caramel/45 bg-caramel/20 text-crema'
                : 'border-latte/25 bg-latte/10 text-latte'
            }`}
          >
            {formatPercent(calculation.differencePercent)} necesario
          </span>
        </div>

        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
            <p className="text-xs text-stone-400">Salón</p>
            <p className="mt-1 text-lg font-semibold text-crema">{formatCurrency(calculation.salonPrice)}</p>
          </div>
          <div className="flex items-center justify-center text-caramel">
            <ArrowRight size={20} />
          </div>
          <div className="rounded-2xl border border-caramel/30 bg-caramel/12 p-3 shadow-[0_12px_34px_rgba(209,132,59,0.12)]">
            <p className="text-xs text-stone-400">Delivery sugerido</p>
            <p className="mt-1 text-lg font-semibold text-crema">{formatCurrency(calculation.deliveryPrice)}</p>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-caramel/25 bg-black/22 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-latte">Diferencia necesaria</p>
          <p className={`mt-2 font-semibold leading-none tracking-tight text-crema ${isEmptyResult ? 'text-3xl' : 'text-4xl sm:text-5xl'}`}>
            {formatCurrency(calculation.difference)}
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-300">
            Para conservar margen, tu precio delivery debería ser: <strong className="text-crema">{formatCurrency(calculation.deliveryPrice)}</strong>
          </p>
        </div>

        <p className="mt-4 rounded-2xl border border-latte/20 bg-latte/10 p-3 text-sm leading-6 text-stone-200">
          Si vendés al mismo precio que en salón, la comisión puede estar comiéndose tu ganancia.
        </p>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-latte">Diagnóstico</p>
          <p className="mt-2 text-sm leading-6 text-stone-200">{getSalonDiagnosisMessage(calculation)}</p>
        </div>

        <p className="mt-4 rounded-2xl border border-caramel/20 bg-caramel/10 p-3 text-sm leading-6 text-stone-200">
          {getSalonInsightMessage(calculation)}
        </p>
      </div>
      <div className="mt-4 grid gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 transition duration-300 hover:border-caramel/25 hover:bg-white/[0.065]">
            <span className="text-sm text-stone-300">{label}</span>
            <strong className="text-right text-sm font-semibold text-crema">{formatCurrency(value)}</strong>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-2xl border border-latte/20 bg-latte/10 p-3 text-xs leading-5 text-stone-300">
        Estimación orientativa. Las condiciones reales pueden variar según plataforma, contrato, promociones,
        impuestos y operación del local.
      </p>
    </div>
  );
}

function ComboResults({ calculation, comboName }) {
  const comboLabel = comboName.trim() || 'Combo';
  const isEmptyResult = calculation.costoTotal === 0 && calculation.precioSugerido === 0;
  const status = getComboStatus(calculation);
  const rows = [
    ['Costo total del combo', calculation.costoTotal],
    ['Precio actual con descuento', calculation.hasCurrentPrice ? calculation.precioConDescuento : null],
    ['Ganancia actual estimada', calculation.hasCurrentPrice ? calculation.gananciaActual : null],
    ['Margen actual estimado', calculation.hasCurrentPrice ? `${calculation.margenActual.toFixed(1)}%` : 'Sin precio actual'],
  ];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-latte">
        Resultado para: <span className="text-crema">{comboLabel}</span>
      </p>
      <div
        className={`mt-4 rounded-[28px] border border-white/10 bg-graphite/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition duration-300 sm:p-6 ${
          isEmptyResult ? 'opacity-75' : 'opacity-100'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-stone-400">Precio sugerido del combo</p>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}>
            {status.label}
          </span>
        </div>

        <p className={`mt-2 font-semibold leading-none tracking-tight text-crema ${isEmptyResult ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl'}`}>
          {formatCurrency(calculation.precioSugerido)}
        </p>
        <p className="mt-3 text-xs font-medium text-latte sm:text-sm">
          Precio estimado para cubrir productos, packaging y margen deseado.
        </p>

        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
            <p className="text-xs text-stone-400">Actual con descuento</p>
            <p className="mt-1 text-lg font-semibold text-crema">
              {calculation.hasCurrentPrice ? formatCurrency(calculation.precioConDescuento) : 'Sin cargar'}
            </p>
          </div>
          <div className="flex items-center justify-center text-caramel">
            <ArrowRight size={20} />
          </div>
          <div className="rounded-2xl border border-caramel/30 bg-caramel/12 p-3 shadow-[0_12px_34px_rgba(209,132,59,0.12)]">
            <p className="text-xs text-stone-400">Sugerido</p>
            <p className="mt-1 text-lg font-semibold text-crema">{formatCurrency(calculation.precioSugerido)}</p>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-caramel/25 bg-black/22 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-latte">Diferencia</p>
          <p className="mt-2 text-4xl font-semibold leading-none tracking-tight text-crema sm:text-5xl">
            {calculation.hasCurrentPrice ? formatCurrency(calculation.diferencia) : 'Sin precio actual'}
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-300">
            {calculation.hasCurrentPrice
              ? 'Comparación entre el precio actual con descuento y el precio sugerido.'
              : 'Cargá un precio actual si querés comparar contra una promo publicada.'}
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-latte">Diagnóstico</p>
          <p className="mt-2 text-sm leading-6 text-stone-200">{getComboDiagnosisMessage(calculation)}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 transition duration-300 hover:border-caramel/25 hover:bg-white/[0.065]">
            <span className="text-sm text-stone-300">{label}</span>
            <strong className="text-right text-sm font-semibold text-crema">
              {typeof value === 'number' ? formatCurrency(value) : value || 'Sin precio actual'}
            </strong>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-2xl border border-latte/20 bg-latte/10 p-3 text-xs leading-5 text-stone-300">
        Estimación orientativa para combos, promos y menús especiales. Revisá costos reales, comisiones, impuestos y
        promociones antes de publicar precios.
      </p>
    </div>
  );
}

function DeliveryVsSalonShareCard({ calculation, productName }) {
  const productLabel = productName.trim() || 'Producto';

  return (
    <section className="mt-5 overflow-hidden rounded-[30px] border border-caramel/30 bg-[#120f0c] shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
      <div className="relative p-5 sm:p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-caramel/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-latte">GastroCalc</p>
              <h3 className="mt-2 text-lg font-semibold uppercase tracking-[0.08em] text-crema">{productLabel}</h3>
            </div>
            <span className="rounded-full border border-caramel/30 bg-caramel/10 px-3 py-1 text-xs font-semibold text-latte">
              Salón vs Delivery
            </span>
          </div>

          <div className="mt-6">
            <p className="text-xs font-medium text-stone-400">Precio sugerido delivery</p>
            <p className="mt-1 text-5xl font-semibold leading-none tracking-tight text-crema">
              {formatCurrency(calculation.deliveryPrice)}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            <ShareMetric label="Salón" value={formatCurrency(calculation.salonPrice)} />
            <ShareMetric label="Delivery" value={formatCurrency(calculation.deliveryPrice)} />
            <ShareMetric label="Diferencia" value={formatPercent(calculation.differencePercent)} />
          </div>

          <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-stone-400">
            Estimación orientativa para comparar canales. Condiciones reales pueden variar.
          </p>
        </div>
      </div>
    </section>
  );
}

function ComboShareCard({ calculation, comboName }) {
  const comboLabel = comboName.trim() || 'Combo';
  const status = getComboStatus(calculation);

  return (
    <section className="mt-5 overflow-hidden rounded-[30px] border border-latte/30 bg-[#120f0c] shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
      <div className="relative p-5 sm:p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-latte/18 blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-latte">GastroCalc</p>
              <h3 className="mt-2 text-lg font-semibold uppercase tracking-[0.08em] text-crema">{comboLabel}</h3>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}>
              {status.label}
            </span>
          </div>

          <div className="mt-6">
            <p className="text-xs font-medium text-stone-400">Precio sugerido del combo</p>
            <p className="mt-1 text-5xl font-semibold leading-none tracking-tight text-crema">
              {formatCurrency(calculation.precioSugerido)}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            <ShareMetric label="Costo" value={formatCurrency(calculation.costoTotal)} />
            <ShareMetric
              label="Actual neto"
              value={calculation.hasCurrentPrice ? formatCurrency(calculation.precioConDescuento) : 'Sin cargar'}
            />
            <ShareMetric
              label="Margen"
              value={calculation.hasCurrentPrice ? `${calculation.margenActual.toFixed(1)}%` : 'Sin cargar'}
            />
          </div>

          <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-stone-400">
            Estimación orientativa para combos y promociones. Costos y condiciones reales pueden variar.
          </p>
        </div>
      </div>
    </section>
  );
}

function getComboStatus(calculation) {
  if (!calculation.hasCurrentPrice) {
    return {
      label: 'Sugerido',
      className: 'border-latte/25 bg-latte/10 text-latte',
    };
  }

  if (calculation.discount >= 20 && calculation.margenActual < calculation.margin) {
    return {
      label: 'Riesgo',
      className: 'border-caramel/45 bg-caramel/20 text-crema',
    };
  }

  if (calculation.margenActual >= calculation.margin) {
    return {
      label: 'Rentable',
      className: 'border-latte/35 bg-latte/12 text-latte',
    };
  }

  if (calculation.margenActual >= calculation.margin * 0.72) {
    return {
      label: 'Ajustado',
      className: 'border-caramel/35 bg-caramel/12 text-latte',
    };
  }

  return {
    label: 'Riesgo',
    className: 'border-caramel/45 bg-caramel/20 text-crema',
  };
}

function getComboDiagnosisMessage(calculation) {
  if (!calculation.precioSugerido) {
    return 'Cargá los costos de los productos para estimar el precio sugerido del combo.';
  }

  if (!calculation.hasCurrentPrice) {
    return 'Podés calcular el precio sugerido aunque todavía no tengas un precio actual publicado.';
  }

  if (calculation.discount >= 20 && calculation.margenActual < calculation.margin) {
    return 'El descuento aplicado reduce fuerte la rentabilidad.';
  }

  if (calculation.margenActual >= calculation.margin) {
    return 'Tu combo parece rentable.';
  }

  if (calculation.margenActual >= calculation.margin * 0.72) {
    return 'Tu combo está muy ajustado.';
  }

  return 'Este combo podría estar perdiendo margen.';
}

function getInsightMessage(calculation) {
  if (!calculation.recommendedPrice) {
    return 'Cargá tus costos para estimar un precio con margen, packaging y comisión incluidos.';
  }

  if (calculation.commissionAmount > calculation.estimatedProfit) {
    return 'Las comisiones delivery pueden afectar fuertemente la rentabilidad.';
  }

  if (calculation.commissionAmount / calculation.recommendedPrice >= 0.3) {
    return 'Revisar packaging y merma puede mejorar el margen real.';
  }

  return 'Si cobrabas menos que esto, probablemente estabas perdiendo margen.';
}

function getSalonInsightMessage(calculation) {
  if (!calculation.deliveryPrice) {
    return 'Cargá el precio de salón para estimar cuánto debería valer en delivery.';
  }

  if (calculation.promotions >= 15) {
    return 'Las promociones pueden afectar fuertemente tu rentabilidad.';
  }

  if (calculation.differencePercent > 15) {
    return 'Con delivery podrías estar perdiendo margen si mantenés el mismo precio de salón.';
  }

  return 'Revisar packaging y comisión puede mejorar tu margen.';
}

function getSalonDiagnosisMessage(calculation) {
  if (!calculation.deliveryPrice) {
    return 'Cuidado: vender al mismo precio que en salón puede ser engañoso.';
  }

  if (calculation.differencePercent < 8) {
    return 'Tu precio delivery parece saludable.';
  }

  if (calculation.commission >= 25) {
    return 'La comisión está reduciendo tu margen.';
  }

  return 'Necesitás ajustar el precio para sostener rentabilidad.';
}

function ShareCard({ calculation, productName }) {
  const productLabel = productName.trim() || 'Producto';

  return (
    <section className="mt-5 overflow-hidden rounded-[30px] border border-caramel/30 bg-[#120f0c] shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
      <div className="relative p-5 sm:p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-caramel/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-latte">GastroCalc</p>
              <h3 className="mt-2 text-lg font-semibold uppercase tracking-[0.08em] text-crema">{productLabel}</h3>
            </div>
            <span className="rounded-full border border-caramel/30 bg-caramel/10 px-3 py-1 text-xs font-semibold text-latte">
              Delivery
            </span>
          </div>

          <div className="mt-6">
            <p className="text-xs font-medium text-stone-400">Precio sugerido</p>
            <p className="mt-1 text-5xl font-semibold leading-none tracking-tight text-crema">
              {formatCurrency(calculation.recommendedPrice)}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <ShareMetric label="Comisión" value={formatCurrency(calculation.commissionAmount)} />
            <ShareMetric label="Ganancia" value={formatCurrency(calculation.estimatedProfit)} />
          </div>

          <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-stone-400">
            Estimación orientativa para screenshot, WhatsApp o historias. Comisiones e impuestos pueden variar.
          </p>
        </div>
      </div>
    </section>
  );
}

function ShareMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-3">
      <p className="text-xs text-stone-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-crema">{value}</p>
    </div>
  );
}

function UpcomingTools() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 sm:pb-14">
      <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-4 shadow-glow sm:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-latte">Hub GastroCalc</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-crema">Otras herramientas gastronómicas</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-stone-400">
            Probá más calculadoras gratuitas para estimar precios, márgenes y rentabilidad.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <a
            href="/simulador-delivery-vs-salon"
            className="group rounded-2xl border border-caramel/25 bg-caramel/10 p-4 transition duration-300 hover:-translate-y-1 hover:border-caramel/50 hover:bg-caramel/15"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-latte text-graphite shadow-[0_12px_34px_rgba(201,164,106,0.2)]">
              <TrendingUp size={21} />
            </div>
            <h3 className="text-lg font-semibold text-crema">Simulador Delivery vs Salón</h3>
            <p className="mt-2 text-sm leading-6 text-stone-300">
              ¿Ya tenés precio de salón? Compará si ese precio sirve para delivery.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-caramel px-4 py-2.5 text-sm font-semibold text-graphite shadow-[0_12px_30px_rgba(209,132,59,0.22)] transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-latte">
              Abrir simulador
              <ArrowRight size={16} />
            </span>
          </a>

          <a
            href="/calculadora-combos-gastronomicos"
            className="group rounded-2xl border border-latte/25 bg-latte/10 p-4 transition duration-300 hover:-translate-y-1 hover:border-latte/50 hover:bg-latte/15"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-crema text-graphite shadow-[0_12px_34px_rgba(241,223,195,0.16)]">
              <BadgePercent size={21} />
            </div>
            <h3 className="text-lg font-semibold text-crema">Calculadora de Combos Gastronómicos</h3>
            <p className="mt-2 text-sm leading-6 text-stone-300">
              Calculá si una promo o combo mantiene margen real.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-caramel px-4 py-2.5 text-sm font-semibold text-graphite shadow-[0_12px_30px_rgba(209,132,59,0.22)] transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-latte">
              Abrir combos
              <ArrowRight size={16} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function SeoContent() {
  const sections = [
    [
      'Calculadora gastronómica para precios de delivery',
      'Esta herramienta ayuda a dueños de cafeterías, restaurantes, hamburgueserías y dark kitchens a estimar un precio de venta para delivery. El cálculo combina costo de producto, packaging, merma, comisión estimada y margen de ganancia deseado para obtener una referencia rápida antes de publicar o ajustar un producto.',
    ],
    [
      'Qué es food cost y por qué importa',
      'El food cost muestra cuánto representa el costo de ingredientes sobre el precio de venta. En Argentina, donde los insumos pueden cambiar con frecuencia, revisar este indicador permite detectar productos con margen débil y tomar mejores decisiones de precio sin depender solo de intuición.',
    ],
    [
      'Cómo afecta la comisión delivery',
      'La comisión de una plataforma reduce el ingreso neto por cada pedido. Si el precio de salón se copia sin ajustes al canal delivery, el margen puede quedar por debajo de lo esperado. Por eso conviene calcular el precio contemplando comisión, packaging, promociones e impuestos asociados.',
    ],
    [
      'Diferencias entre precio de salón y precio delivery',
      'El precio de salón suele tener una estructura distinta al precio de delivery. En delivery aparecen costos adicionales como envases, bolsas, sellos, comisiones y posibles descuentos comerciales. Separar ambos canales ayuda a medir mejor la rentabilidad real de cada venta.',
    ],
    [
      'Cómo estimar margen de ganancia gastronómico',
      'Para estimar margen conviene partir del costo real del producto, sumar merma y packaging, y luego definir qué ganancia necesita dejar cada unidad. El margen ideal depende del tipo de local, volumen de ventas, alquiler, personal, impuestos y canal de venta.',
    ],
    [
      'Errores comunes al calcular precios gastronómicos',
      'Algunos errores frecuentes son no actualizar costos de ingredientes, olvidar packaging, subestimar la merma, no separar salón de delivery y usar una comisión promedio sin revisar el contrato o la modalidad de logística.',
    ],
  ];

  return (
    <section className="border-t border-white/10 bg-black/16" aria-labelledby="seo-content-title">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-latte">Guía rápida</p>
          <h2 id="seo-content-title" className="mt-2 text-2xl font-semibold tracking-tight text-crema sm:text-3xl">
            Cómo calcular precios y margen en gastronomía
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-300 sm:text-base">
            Conceptos clave para usar la calculadora con criterio y ajustar precios de delivery en el mercado
            gastronómico argentino.
          </p>
        </div>
        <div className="space-y-7">
          {sections.map(([title, text]) => (
            <article key={title}>
              <h3 className="text-xl font-semibold text-crema">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-stone-300 sm:text-base">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-10 sm:px-6 sm:pb-14" aria-labelledby="faq-title">
      <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-4 shadow-glow sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-latte">FAQ</p>
        <h2 id="faq-title" className="mt-2 text-2xl font-semibold tracking-tight text-crema sm:text-3xl">
          Preguntas frecuentes sobre precios delivery
        </h2>
        <div className="mt-6 space-y-3">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-white/10 bg-black/20 p-4 transition duration-300 open:border-caramel/25 open:bg-caramel/10"
            >
              <summary className="cursor-pointer list-none text-base font-semibold text-crema outline-none marker:hidden">
                {item.question}
              </summary>
              <p className="mt-3 text-sm leading-7 text-stone-300">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function SalonSeoContent() {
  const sections = [
    [
      'Delivery vs salón en gastronomía',
      'El precio de salón y el precio delivery no siempre deberían ser iguales. En delivery aparecen comisiones, packaging y descuentos que pueden reducir el neto recibido por el local. Este diagnóstico compara precio salón vs delivery para detectar si estás regalando rentabilidad.',
    ],
    [
      'Cuánto aumentar el precio en delivery',
      'Para estimar cuánto aumentar el precio en delivery conviene partir del precio de salón, sumar packaging y ajustar por comisión de app y promociones. El resultado muestra la diferencia necesaria para sostener una ganancia similar.',
    ],
    [
      'Comisión app delivery y margen real',
      'Las apps como PedidosYa, Rappi u otras plataformas pueden tener condiciones distintas según contrato, zona, logística y campañas comerciales. Por eso esta herramienta trabaja con estimaciones editables en lugar de porcentajes oficiales.',
    ],
  ];

  return (
    <section className="border-t border-white/10 bg-black/16" aria-labelledby="salon-seo-title">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-latte">Guía rápida</p>
          <h2 id="salon-seo-title" className="mt-2 text-2xl font-semibold tracking-tight text-crema sm:text-3xl">
            Cómo comparar delivery y salón
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-300 sm:text-base">
            Una referencia práctica para dueños de restaurantes, cafeterías, hamburgueserías y dark kitchens que venden
            en salón y por delivery.
          </p>
        </div>
        <div className="space-y-7">
          {sections.map(([title, text]) => (
            <article key={title}>
              <h3 className="text-xl font-semibold text-crema">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-stone-300 sm:text-base">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SalonFaqSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-10 sm:px-6 sm:pb-14" aria-labelledby="salon-faq-title">
      <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-4 shadow-glow sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-latte">FAQ</p>
        <h2 id="salon-faq-title" className="mt-2 text-2xl font-semibold tracking-tight text-crema sm:text-3xl">
          Preguntas frecuentes sobre delivery vs salón
        </h2>
        <div className="mt-6 space-y-3">
          {salonFaqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-white/10 bg-black/20 p-4 transition duration-300 open:border-caramel/25 open:bg-caramel/10"
            >
              <summary className="cursor-pointer list-none text-base font-semibold text-crema outline-none marker:hidden">
                {item.question}
              </summary>
              <p className="mt-3 text-sm leading-7 text-stone-300">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolInterlinking() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 sm:pb-14" aria-labelledby="other-tools-title">
      <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-4 shadow-glow sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-latte">GastroCalc</p>
        <h2 id="other-tools-title" className="mt-2 text-2xl font-semibold tracking-tight text-crema">
          Otras herramientas gastronómicas
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-stone-400">
          Probá más calculadoras gratuitas para estimar precios, márgenes y rentabilidad.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            href="/calculadora-precio-delivery"
            className="group rounded-2xl border border-caramel/25 bg-caramel/10 p-4 transition duration-300 hover:-translate-y-1 hover:border-caramel/45 hover:bg-caramel/15"
          >
            <h3 className="text-lg font-semibold text-crema">¿Todavía no sabés tu precio base?</h3>
            <p className="mt-2 text-sm leading-6 text-stone-300">
              Calculá primero tu precio sugerido desde costos.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-caramel px-4 py-2.5 text-sm font-semibold text-graphite shadow-[0_12px_30px_rgba(209,132,59,0.22)] transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-latte">
              Abrir calculadora
              <ArrowRight size={16} />
            </span>
          </a>
          <a
            href="/calculadora-combos-gastronomicos"
            className="group rounded-2xl border border-latte/25 bg-latte/10 p-4 transition duration-300 hover:-translate-y-1 hover:border-latte/45 hover:bg-latte/15"
          >
            <h3 className="text-lg font-semibold text-crema">Calculadora de Combos Gastronómicos</h3>
            <p className="mt-2 text-sm leading-6 text-stone-400">
              Calculá si una promo o combo mantiene margen real.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-caramel px-4 py-2.5 text-sm font-semibold text-graphite shadow-[0_12px_30px_rgba(209,132,59,0.22)] transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-latte">
              Abrir combos
              <ArrowRight size={16} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function ComboToolInterlinking() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 sm:pb-14" aria-labelledby="combo-other-tools-title">
      <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-4 shadow-glow sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-latte">GastroCalc</p>
        <h2 id="combo-other-tools-title" className="mt-2 text-2xl font-semibold tracking-tight text-crema">
          Otras herramientas gastronómicas
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-stone-400">
          Complementá el análisis del combo con precio base, delivery y comparación contra salón.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            href="/calculadora-precio-delivery"
            className="group rounded-2xl border border-caramel/25 bg-caramel/10 p-4 transition duration-300 hover:-translate-y-1 hover:border-caramel/45 hover:bg-caramel/15"
          >
            <h3 className="text-lg font-semibold text-crema">Calculadora de comisión delivery</h3>
            <p className="mt-2 text-sm leading-6 text-stone-300">
              Calculá el precio sugerido de un producto individual con comisión, packaging y margen.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-caramel px-4 py-2.5 text-sm font-semibold text-graphite shadow-[0_12px_30px_rgba(209,132,59,0.22)] transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-latte">
              Abrir calculadora
              <ArrowRight size={16} />
            </span>
          </a>
          <a
            href="/simulador-delivery-vs-salon"
            className="group rounded-2xl border border-latte/25 bg-latte/10 p-4 transition duration-300 hover:-translate-y-1 hover:border-latte/45 hover:bg-latte/15"
          >
            <h3 className="text-lg font-semibold text-crema">Simulador Delivery vs Salón</h3>
            <p className="mt-2 text-sm leading-6 text-stone-300">
              Compará cuánto debería valer un producto en delivery frente al precio de salón.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-caramel px-4 py-2.5 text-sm font-semibold text-graphite shadow-[0_12px_30px_rgba(209,132,59,0.22)] transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-latte">
              Abrir simulador
              <ArrowRight size={16} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function ComboSeoContent() {
  const sections = [
    [
      'Calculadora combos gastronómicos',
      'Esta herramienta ayuda a calcular el precio de combos, promos y menús especiales sumando productos, packaging, descuento aplicado y margen deseado. Sirve para restaurantes, hamburgueserías, cafeterías y emprendimientos gastronómicos.',
    ],
    [
      'Cómo calcular precio combo',
      'El precio sugerido parte del costo total del combo y lo divide por el margen objetivo. Así podés revisar si el precio actual con descuento cubre costos y deja rentabilidad real.',
    ],
    [
      'Rentabilidad combo restaurante',
      'Un combo puede vender más unidades y subir el ticket promedio, pero también puede perder margen si el descuento es alto o si el packaging no fue incluido en el cálculo.',
    ],
    [
      'Promo gastronómica rentable',
      'Antes de publicar una promoción conviene comparar precio actual vs precio sugerido. Si la diferencia es alta, el combo puede necesitar ajuste de precio, menor descuento o cambios en los productos incluidos.',
    ],
  ];

  return (
    <section className="border-t border-white/10 bg-black/16" aria-labelledby="combo-seo-title">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-latte">Guía rápida</p>
          <h2 id="combo-seo-title" className="mt-2 text-2xl font-semibold tracking-tight text-crema sm:text-3xl">
            Cómo calcular promociones gastronómicas
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-300 sm:text-base">
            Conceptos clave para revisar el precio menú ejecutivo, margen combo hamburguesería y promociones de
            cafetería sin perder rentabilidad.
          </p>
        </div>
        <div className="space-y-7">
          {sections.map(([title, text]) => (
            <article key={title}>
              <h3 className="text-xl font-semibold text-crema">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-stone-300 sm:text-base">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComboFaqSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-10 sm:px-6 sm:pb-14" aria-labelledby="combo-faq-title">
      <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-4 shadow-glow sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-latte">FAQ</p>
        <h2 id="combo-faq-title" className="mt-2 text-2xl font-semibold tracking-tight text-crema sm:text-3xl">
          Preguntas frecuentes sobre combos gastronómicos
        </h2>
        <div className="mt-6 space-y-3">
          {comboFaqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-white/10 bg-black/20 p-4 transition duration-300 open:border-caramel/25 open:bg-caramel/10"
            >
              <summary className="cursor-pointer list-none text-base font-semibold text-crema outline-none marker:hidden">
                {item.question}
              </summary>
              <p className="mt-3 text-sm leading-7 text-stone-300">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-glow sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-latte">GastroCalc</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-crema sm:text-3xl">
            Soluciones digitales para gastronomía
          </h2>
          <p className="mt-3 text-sm leading-6 text-stone-300 sm:text-base">
            Landing pages, menús digitales y herramientas para restaurantes, cafeterías y dark kitchens.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-2xl bg-caramel px-5 py-3 text-sm font-semibold text-graphite shadow-[0_12px_30px_rgba(209,132,59,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-latte"
          >
            Ver herramientas
          </a>
          <span className="inline-flex items-center justify-center rounded-2xl border border-crema/10 bg-black/20 px-5 py-3 text-sm font-semibold text-stone-300">
            Próximamente servicios premium
          </span>
        </div>
      </div>
    </footer>
  );
}

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
