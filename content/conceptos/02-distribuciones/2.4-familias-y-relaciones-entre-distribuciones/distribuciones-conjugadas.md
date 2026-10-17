---
id: distribuciones-conjugadas
titulo: Distribuciones conjugadas
titulo_en: Conjugate distributions
alias:
  - prior conjugado
  - a priori conjugada
  - familia conjugada
modulo: 2
submodulo: '2.4'
orden: 4
nivel: intermedio
prerrequisitos:
  - estadisticos-suficientes-naturales-y-parametros-naturales
  - distribucion-beta
  - teorema-de-bayes
relaciones:
  - tipo: relacionado
    id: distribucion-de-dirichlet
etiquetas:
  - estadística bayesiana
  - a priori
  - a posteriori
  - actualización
  - beta
resumen: >
  Una distribución a priori es conjugada de un modelo si la posterior queda en la misma familia. La
  actualización se reduce a sumar los estadísticos suficientes de los datos a los hiperparámetros.
formula: '\operatorname{Beta}(a, b) \;\xrightarrow{\;k \text{ éxitos en } n\;}\; \operatorname{Beta}(a + k,\ b + n - k)'
visualizacion:
  componente: FamilyLab
  parametros:
    modo: conjugada
    modelo: beta-bernoulli
    valores:
      a: 2
      b: 2
      truth: 0.7
    casos:
      - nombre: 'Tratamiento nuevo'
        descripcion: 'A priori Beta(2, 2), centrada en 0.5 con mucha incertidumbre; con cada paciente la posterior se acerca a la tasa verdadera de 0.7.'
        valores: {a: 2, b: 2, truth: 0.7}
      - nombre: 'Experiencia previa'
        descripcion: 'A priori Beta(15, 15): equivale a 30 pacientes previos con la mitad de éxitos; los datos nuevos la mueven más despacio.'
        valores: {a: 15, b: 15, truth: 0.7}
      - nombre: 'A priori uniforme'
        descripcion: 'Beta(1, 1): todas las tasas igual de plausibles; la posterior es proporcional a la verosimilitud.'
        valores: {a: 1, b: 1, truth: 0.3}
referencias:
  - clave: gelman-bda
  - clave: mcelreath
  - clave: bishop
publicado: true
---

## Intuición

Un hospital prueba un tratamiento nuevo. Antes de empezar, el equipo cree que la tasa de respuesta está alrededor del 50 %, con mucha duda. Cada paciente que responde o no responde modifica esa creencia. En general, combinar una creencia previa con datos mediante la regla de Bayes produce una distribución complicada que hay que calcular numéricamente.

Con ciertas parejas de distribución previa y modelo de datos, sin embargo, la cuenta es inmediata: la creencia posterior pertenece a la misma familia que la previa, solo con parámetros actualizados. Si la creencia sobre la tasa es una beta, después de observar pacientes sigue siendo una beta: a su primer parámetro se le suman los éxitos y al segundo los fracasos. Las parejas con esta propiedad se llaman conjugadas.

Los parámetros de la previa se pueden leer como datos imaginarios: una beta con parámetros 2 y 2 equivale a haber visto dos éxitos y dos fracasos antes del estudio. Así se ve con claridad cuánto pesa la creencia inicial frente a los datos. Toda familia exponencial tiene su familia conjugada, y la actualización consiste en sumar los estadísticos suficientes de los datos.

## Definición

:::definicion[Familia conjugada]
Una familia $\mathcal{P}$ de distribuciones sobre el parámetro $\theta$ es **conjugada** para el modelo $p(\mathbf{x} \mid \theta)$ si, para toda a priori $\pi(\theta) \in \mathcal{P}$ y todos los datos $\mathbf{x}$, la posterior
$$
\pi(\theta \mid \mathbf{x}) = \frac{p(\mathbf{x} \mid \theta)\,\pi(\theta)}{\int p(\mathbf{x} \mid \theta')\,\pi(\theta')\,d\theta'}
$$
también pertenece a $\mathcal{P}$.
:::

Pares conjugados principales:

- **Beta y Bernoulli o binomial:** $\operatorname{Beta}(a, b) \to \operatorname{Beta}(a + k, b + n - k)$ tras $k$ éxitos en $n$ ensayos.
- **Gamma y Poisson:** $\operatorname{Gamma}(a, b) \to \operatorname{Gamma}(a + \sum x_i, b + n)$, con $b$ como tasa.
- **Normal y normal con varianza $\sigma^{2}$ conocida:** $\mathcal{N}(m_0, s_0^{2}) \to \mathcal{N}(m_n, s_n^{2})$ con $\frac{1}{s_n^{2}} = \frac{1}{s_0^{2}} + \frac{n}{\sigma^{2}}$ y $m_n = s_n^{2}\left(\frac{m_0}{s_0^{2}} + \frac{\sum x_i}{\sigma^{2}}\right)$.
- **Dirichlet y multinomial:** $\operatorname{Dir}(\boldsymbol{\alpha}) \to \operatorname{Dir}(\boldsymbol{\alpha} + \mathbf{n})$.

:::nota[Qué es X]
$X$ = una observación del modelo, como la respuesta de un paciente al tratamiento (1 si responde, 0 si no); la incógnita es la tasa $\theta$.
:::

:::nota[Qué hace cada parámetro]
- **$a$, éxitos previos:** el peso inicial hacia el éxito. Si aumenta, la a priori se desplaza hacia tasas altas.
- **$b$, fracasos previos:** el peso inicial hacia el fracaso. Si $a$ y $b$ aumentan juntos, la a priori se angosta y los datos la mueven más despacio.
- **Tasa verdadera:** la que genera los datos simulados. Si cambia, la posterior termina concentrándose alrededor del nuevo valor.
:::

:::nota[Qué significa cada símbolo]
- $\theta$: parámetro desconocido; $\pi(\theta)$: a priori; $\pi(\theta \mid \mathbf{x})$: posterior.
- $p(\mathbf{x} \mid \theta)$: verosimilitud; $\mathcal{P}$: familia de distribuciones.
- $a$, $b$: hiperparámetros de la beta o de la gamma; $k$: éxitos; $n$: número de observaciones.
- $x_i$: observaciones; $m_0$, $s_0^{2}$: media y varianza a priori; $m_n$, $s_n^{2}$: a posteriori; $\sigma^{2}$: varianza de los datos.
- $\boldsymbol{\alpha}$: concentraciones de la Dirichlet; $\mathbf{n}$: conteos por categoría.
:::

## Cómo usar la visualización

La curva punteada es la a priori y la continua la posterior; la línea vertical marca el valor verdadero y la franja sombreada el intervalo creíble del 95 %. Cada paso de la reproducción agrega una observación simulada y el botón agrega diez. Los controles fijan los hiperparámetros a priori y el valor verdadero; el panel da los hiperparámetros a posteriori, su media y el intervalo. Los casos cargan un tratamiento nuevo, una a priori con experiencia previa y una uniforme.

Reproduce con la a priori Beta(2, 2) y observa que la posterior se angosta y se mueve hacia 0.7. Carga la experiencia previa, Beta(15, 15), y observa que tarda más en llegar. Cambia la tasa verdadera después de 50 observaciones y observa cuánto le cuesta a la posterior seguirla.

## Ejemplo

Para la tasa de respuesta $\theta$ de un tratamiento se usa la a priori $\operatorname{Beta}(2, 2)$. Se tratan 20 pacientes y responden 14.

1. A priori: media $2/4 = 0.5$ e intervalo central del 95 % entre 0.094 y 0.906.
2. Actualización: $\operatorname{Beta}(2 + 14,\ 2 + 6) = \operatorname{Beta}(16, 8)$.
3. Media a posteriori: $16/24 \approx 0.667$, entre la media a priori 0.5 y la proporción observada 0.7.
4. Intervalo creíble del 95 %: entre 0.471 y 0.836.
5. La media a posteriori es un promedio ponderado: $\frac{4}{24}\cdot 0.5 + \frac{20}{24}\cdot 0.7 = 0.667$; los 4 datos imaginarios pesan menos que los 20 reales.

:::figura[Tratamiento nuevo: la a priori Beta(2, 2) (punteada) se convierte en Beta(16, 8) tras 14 respuestas de 20; la reproducción agrega pacientes uno por uno.]{componente="FamilyLab"}
```yaml
modo: conjugada
modelo: beta-bernoulli
valores:
  a: 2
  b: 2
  truth: 0.7
```
:::

## Propiedades

- **Datos imaginarios:** los hiperparámetros cuentan observaciones previas; en la beta, $a + b$ es el tamaño de esa muestra imaginaria.
- **Promedio ponderado:** en los pares principales la media a posteriori está entre la media a priori y la estimación de los datos, con pesos proporcionales a sus tamaños.
- **Secuencialidad:** actualizar con todos los datos juntos o uno por uno da la misma posterior.
- **Concentración:** con muchos datos la posterior se concentra alrededor del valor verdadero y la a priori pierde influencia.
- **Familia exponencial:** si el modelo es $h(x)\exp(\eta T(x) - A(\eta))$, la familia $\pi(\eta) \propto \exp(\eta\tau - \nu A(\eta))$ es conjugada, y se actualiza con $\tau \to \tau + \sum T(x_i)$, $\nu \to \nu + n$.
- **Predictiva:** la distribución de una observación futura también tiene forma cerrada; en el par beta y binomial es la beta-binomial.

:::figura[Casos con contexto (tratamiento nuevo, experiencia previa, a priori uniforme): cada botón carga los hiperparámetros y la tasa verdadera, y una frase explica cuánto pesa la creencia inicial.]{componente="FamilyLab"}
```yaml
modo: conjugada
modelo: beta-bernoulli
valores:
  a: 1
  b: 1
  truth: 0.3
casos:
  - nombre: 'Tratamiento nuevo'
    descripcion: 'Beta(2, 2): la posterior llega rápido a 0.7.'
    valores: {a: 2, b: 2, truth: 0.7}
  - nombre: 'Experiencia previa'
    descripcion: 'Beta(15, 15): 30 pacientes imaginarios frenan la actualización.'
    valores: {a: 15, b: 15, truth: 0.7}
  - nombre: 'A priori uniforme'
    descripcion: 'Beta(1, 1): la posterior sigue a la verosimilitud.'
    valores: {a: 1, b: 1, truth: 0.3}
```
:::

:::figura[Gamma y Poisson: con a priori Gamma(2, 1) para la tasa de llamadas por minuto y datos de tasa 4, cada conteo suma su valor a la forma y 1 a la tasa.]{componente="FamilyLab"}
```yaml
modo: conjugada
modelo: gamma-poisson
valores:
  a: 2
  b: 1
  truth: 4
```
:::

:::figura[Normal con varianza conocida: con a priori N(0, 2²) y datos de media 1.5, la posterior se angosta como 1/(1/s₀² + n) y su media se acerca a 1.5.]{componente="FamilyLab"}
```yaml
modo: conjugada
modelo: normal-normal
valores:
  a: 0
  b: 2
  truth: 1.5
```
:::

## Errores comunes

- **Elegir una a priori conjugada solo por comodidad.** La conjugación facilita el cálculo, pero la a priori debe reflejar lo que se sabe; si no lo hace, se usa otra aunque requiera métodos numéricos.
- **Creer que una a priori "sin información" no influye.** Con pocos datos, incluso Beta(1, 1) mueve la media: con 3 éxitos en 3 ensayos da 0.8, no 1.
- **Olvidar la parametrización.** En la gamma y Poisson el segundo hiperparámetro es una tasa; si se usa como escala, la posterior sale mal.
- **Confundir el intervalo creíble con uno de confianza.** El creíble dice dónde está el parámetro con probabilidad 0.95 según la posterior; el de confianza es una propiedad del procedimiento en repeticiones.

:::figura[A priori fuerte contra los datos: con Beta(15, 15) y tasa verdadera 0.3, la posterior tarda decenas de observaciones en abandonar la zona de 0.5.]{componente="FamilyLab"}
```yaml
modo: conjugada
modelo: beta-bernoulli
valores:
  a: 15
  b: 15
  truth: 0.3
```
:::

## Conexiones

La actualización aplica el [[teorema-de-bayes]] a una familia que se reproduce. La [[distribucion-beta]] es conjugada de la [[distribucion-binomial]], la [[distribucion-gamma]] de la [[distribucion-de-poisson]] y la [[distribucion-de-dirichlet]] de la [[distribucion-multinomial]]; para covarianzas se usa la [[distribucion-de-wishart-inversa]]. La actualización suma los [[estadisticos-suficientes-naturales-y-parametros-naturales|estadísticos suficientes]] de la [[familia-exponencial]]. La predictiva de una beta con datos binomiales es la [[distribucion-beta-binomial]]. El [[mapa-de-relaciones-entre-distribuciones]] reúne estas relaciones.

## Formulario

:::formula[Regla de Bayes]
$$
\pi(\theta \mid \mathbf{x}) \propto p(\mathbf{x} \mid \theta)\,\pi(\theta)
$$

- $\pi(\theta)$: a priori; $p(\mathbf{x} \mid \theta)$: verosimilitud; $\pi(\theta \mid \mathbf{x})$: posterior.
:::

:::formula[Beta y binomial]
$$
\operatorname{Beta}(a, b) \to \operatorname{Beta}(a + k,\ b + n - k), \qquad \mathbb{E}[\theta \mid \mathbf{x}] = \frac{a + k}{a + b + n}
$$

- $k$: éxitos; $n$: ensayos; $a$, $b$: hiperparámetros.
:::

:::formula[Gamma y Poisson]
$$
\operatorname{Gamma}(a, b) \to \operatorname{Gamma}\!\Big(a + \sum_{i} x_i,\ b + n\Big)
$$

- $a$: forma; $b$: tasa; $x_i$: conteos observados.
:::

:::formula[Normal con varianza conocida]
$$
\frac{1}{s_n^{2}} = \frac{1}{s_0^{2}} + \frac{n}{\sigma^{2}}, \qquad m_n = s_n^{2}\left(\frac{m_0}{s_0^{2}} + \frac{\sum_i x_i}{\sigma^{2}}\right)
$$

- $m_0$, $s_0^{2}$: media y varianza a priori; $m_n$, $s_n^{2}$: a posteriori; $\sigma^{2}$: varianza de cada dato.
:::

:::formula[Media a posteriori como promedio ponderado]
$$
\frac{a + k}{a + b + n} = \frac{a + b}{a + b + n}\cdot\frac{a}{a + b} + \frac{n}{a + b + n}\cdot\frac{k}{n}
$$

- $\frac{a}{a+b}$: media a priori; $\frac{k}{n}$: proporción observada.
:::
