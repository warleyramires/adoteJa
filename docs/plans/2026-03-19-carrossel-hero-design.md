# Carrossel de Pets no Hero — Design

## Objetivo

Substituir o card "Nosso impacto" (stats fictícios) na seção hero da `HomePage` por um carrossel das imagens reais de pets da pasta `assets/`.

## Abordagem

CSS puro + `useState`/`useEffect` — sem dependências externas. Adequado para 5 imagens estáticas.

## Imagens

Localização: `AdoteJaFrontend/src/assets/`

- `andrew-s-ouo1hbizWwo-unsplash.jpg`
- `veronika-jorjobert-27w3ULIIJfI-unsplash.jpg`
- `alvan-nee-T-0EW-SEbsE-unsplash.jpg`
- `mia-anderson-2k6v10Y2dIg-unsplash.jpg`
- `sebastian-coman-travel-Kt5tyYM_uas-unsplash.jpg`

## Layout

- Container: `aspect-[4/3] rounded-3xl overflow-hidden relative` (mesmo padrão de `PetDetailPage`)
- Imagem: `object-cover w-full h-full transition-opacity duration-700`
- Dots: centralizados na parte inferior, dentro do container
- Setas: `←` `→` posicionadas nas laterais, sempre visíveis
- Autoplay: 3s, pausado no hover (`onMouseEnter`/`onMouseLeave`)

## Comportamento

- Ciclo infinito (volta ao índice 0 após o último)
- Troca via fade (`opacity-0` → `opacity-100`)
- Setas e dots controlam índice manualmente e resetam o timer do autoplay

## Localização

Tudo em `AdoteJaFrontend/src/pages/HomePage.tsx` — sem novo componente.
