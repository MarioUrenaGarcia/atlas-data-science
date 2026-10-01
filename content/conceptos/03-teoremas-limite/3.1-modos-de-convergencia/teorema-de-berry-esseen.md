---
id: teorema-de-berry-esseen
titulo: Teorema de Berry-Esseen
titulo_en: Berry-Esseen theorem
alias:
  - desigualdad de Berry-Esseen
  - velocidad de convergencia del TCL
modulo: 3
submodulo: '3.1'
orden: 13
nivel: avanzado
prerrequisitos:
  - tcl-de-lindeberg-levy
etiquetas:
  - teorema central del límite
  - velocidad de convergencia
  - tercer momento
  - error de aproximación
resumen: >
  Acota el error de la aproximación normal: la mayor diferencia entre la distribución de la media
  estandarizada y la normal es a lo más C ρ/(σ³√n), donde ρ es el tercer momento absoluto centrado.
formula: '\sup_{z \in \mathbb{R}} \Big|P\Big(\frac{\sqrt{n}(\bar{X}_n - \mu)}{\sigma} \le z\Big) - \Phi(z)\Big| \le \frac{C\,\rho}{\sigma^3\sqrt{n}}, \qquad \rho = \mathbb{E}|X - \mu|^3'
visualizacion:
  componente: CentralLimit
  parametros:
    modo: berry-esseen
    poblacion: bernoulli
    poblaciones:
      - bernoulli
      - exponencial
      - uniforme
      - dado
      - lognormal
      - asimetrica-discreta
    nMaximo: 60
referencias:
  - clave: durrett
publicado: true
---

## Intuición

El teorema central del límite dice que la aproximación normal termina funcionando, pero no dice con cuántos datos. Un equipo que analiza la tasa de abandono de un sitio web, donde solo uno de cada cinco visitantes abandona, necesita saber si con 100 sesiones la aproximación normal ya es confiable o si el error todavía es grande.

El teorema de Berry-Esseen responde con una cota garantizada. El error máximo entre la distribución verdadera de la media estandarizada y la normal decrece como $1/\sqrt{n}$, y la constante depende de qué tan asimétrica y de colas pesadas es la población, medida por el tercer momento absoluto relativo a la desviación estándar al cubo. Poblaciones simétricas y compactas, como la uniforme, tienen un cociente pequeño; poblaciones con eventos raros, como una Bernoulli con probabilidad pequeña, tienen un cociente grande y necesitan más datos. La cota vale para cualquier $n$, no solo en el límite, y no puede mejorar su orden en general: para variables discretas, los escalones de la distribución tienen tamaño del orden de $1/\sqrt{n}$.

## Definición

:::teorema[Berry-Esseen]
Sean $X_1, \dots, X_n$ independientes e idénticamente distribuidas con media $\mu$, varianza $\sigma^2 > 0$ y $\rho = \mathbb{E}|X_1 - \mu|^3 < \infty$. Sea $F_n$ la función de distribución de $Z_n = \sqrt{n}(\bar{X}_n - \mu)/\sigma$. Entonces, para todo $n \ge 1$,
$$
\sup_{z \in \mathbb{R}} \big|F_n(z) - \Phi(z)\big| \le \frac{C\,\rho}{\sigma^3\sqrt{n}},
$$
donde $C$ es una constante universal. Se sabe que $C \le 0.4748$ (Shevtsova, 2011) y que no puede ser menor que $0.4097$.
:::

Para sumandos independientes no idénticos, con $\rho_i = \mathbb{E}|X_i - \mu_i|^3$ y $s_n^2 = \sum \sigma_i^2$, vale una cota análoga con el cociente de Lyapunov: $\sup_z |F_n(z) - \Phi(z)| \le C' \sum_i \rho_i / s_n^3$, con otra constante universal $C'$.

:::nota[Qué significa cada símbolo]
- $\mu$, $\sigma^2$: media y varianza de cada observación.
- $\rho = \mathbb{E}|X_1 - \mu|^3$: tercer momento absoluto centrado.
- $\rho/\sigma^3$: medida adimensional de asimetría y peso de colas.
- $F_n$: función de distribución de la media estandarizada $Z_n$.
- $\Phi$: función de distribución normal estándar.
- $\sup_z$: mayor diferencia sobre todos los valores $z$, la distancia de Kolmogorov.
- $C$: constante universal, que no depende de la población ni de $n$.
- $\rho_i$, $s_n^2$: versiones para sumandos no idénticos.
:::

## Cómo usar la visualización

El panel superior compara la función de distribución de $Z_n$ con $\Phi$ y marca con un segmento la mayor diferencia vertical. El inferior, en ejes logarítmicos, grafica esa diferencia según $n$ junto con la cota $C\rho/(\sigma^3\sqrt{n})$; en esta escala ambas son aproximadamente rectas de pendiente $-1/2$. El panel reporta $\rho$, $\sigma^3$, la distancia, la cota y la distancia multiplicada por $\sqrt{n}$.

Con la Bernoulli de $p = 0.2$ la mayor diferencia aparece en un escalón cerca de 0 y vale 0.178 con $n = 10$; la cota es 0.255. Con la uniforme la distancia cae mucho más rápido que la cota, porque la población es simétrica. En todos los casos la curva observada queda por debajo de la cota.

## Ejemplo

En un sitio web cada sesión termina en abandono con probabilidad $p = 0.2$, de forma independiente. Se aproxima con la normal la distribución de la proporción de abandonos en $n = 100$ sesiones.

1. Para $X \sim \operatorname{Bernoulli}(0.2)$: $\sigma^2 = 0.2 \cdot 0.8 = 0.16$, $\sigma^3 = 0.064$.
2. Tercer momento: $\rho = p(1-p)\big[p^2 + (1-p)^2\big] = 0.16 \cdot 0.68 = 0.1088$, y $\rho/\sigma^3 = 1.70$.
3. Cota: $\frac{0.4748 \cdot 1.70}{\sqrt{100}} = 0.081$. Ninguna probabilidad calculada con la normal se equivoca en más de 0.081.
4. La distancia real, calculada con la distribución binomial exacta, es 0.059: la cota es correcta y no mucho más grande.
5. Para garantizar un error menor que 0.01 hacen falta $n \ge \big(\frac{0.4748 \cdot 1.70}{0.01}\big)^2 \approx 6514$ sesiones.

:::figura[El ejemplo del sitio web: Bernoulli con p = 0.2. La distancia exacta queda bajo la cota de Berry-Esseen para todo n; la mayor diferencia está en un escalón de la binomial.]{componente="CentralLimit"}
```yaml
modo: berry-esseen
poblacion: bernoulli
nMaximo: 60
```
:::

## Propiedades

- **Orden $1/\sqrt{n}$ óptimo:** para la moneda equilibrada, el escalón central de la binomial mide del orden de $1/\sqrt{n}$, así que ninguna cota puede decaer más rápido para toda población.
- **Constante relativa a la forma:** $\rho/\sigma^3 \ge 1$ siempre, por la desigualdad de Jensen. Para la uniforme vale 1.30, para la exponencial $12/e - 2 = 2.41$.
- **Tamaño de muestra:** para garantizar error menor que $\eta$ basta $n \ge \big(C\rho/(\sigma^3\eta)\big)^2$.
- **Poblaciones simétricas:** el error real suele ser de orden $1/n$, mucho menor que la cota, porque el término de orden $1/\sqrt{n}$ del desarrollo de Edgeworth es proporcional a la asimetría.
- **Uniforme en $z$:** la cota vale para todos los $z$ a la vez, pero en las colas el error relativo puede ser grande.

:::figura[Propiedad: población simétrica. Con la uniforme la distancia observada cae mucho más rápido que la cota, que solo usa ρ/σ³ = 1.30.]{componente="CentralLimit"}
```yaml
modo: berry-esseen
poblacion: uniforme
nMaximo: 40
```
:::

:::figura[Propiedad: población asimétrica y continua. Con la exponencial, ρ/σ³ vale 2.41 y la distancia sigue de cerca la pendiente -1/2 de la cota.]{componente="CentralLimit"}
```yaml
modo: berry-esseen
poblacion: exponencial
nMaximo: 60
```
:::

## Errores comunes

- **Leer la cota como el error real.** Es una garantía en el peor caso; el error real puede ser mucho menor.
- **Aplicarla sin tercer momento finito.** Con colas pesadas, $\rho = \infty$ y la cota no dice nada; la convergencia puede ser mucho más lenta.
- **Usarla para errores relativos en las colas.** Una diferencia absoluta de 0.01 es enorme si la probabilidad que se aproxima es 0.001.
- **Olvidar la estandarización.** La cota es para $Z_n$; para la suma o la media sin estandarizar se transforma el punto $z$, no el error.

:::figura[Error común: confiar en reglas fijas de tamaño de muestra. Con una población que rara vez toma un valor grande, la distancia real todavía vale 0.07 con n = 20 y la cota garantiza apenas 0.13 con n = 60.]{componente="CentralLimit"}
```yaml
modo: berry-esseen
poblacion: asimetrica-discreta
nMaximo: 60
```
:::

## Conexiones

Cuantifica la velocidad del [[tcl-de-lindeberg-levy]] y del [[teorema-central-del-limite]] en general, en la métrica de la [[convergencia-en-distribucion]] dada por la mayor diferencia entre funciones de distribución. Su cociente $\rho/(\sigma^3\sqrt{n})$ es el de la condición del [[tcl-de-lyapunov]] con $\delta = 1$. Las fallas por colas pesadas se estudian en [[cuando-el-tcl-falla]], y las probabilidades de colas extremas, donde la normal falla en términos relativos, en la [[teoria-de-grandes-desviaciones]].

## Formulario

:::formula[Desigualdad de Berry-Esseen]
$$
\sup_{z} \big|F_n(z) - \Phi(z)\big| \le \frac{C\,\rho}{\sigma^3\sqrt{n}}
$$

- $F_n$: distribución de la media estandarizada.
- $\Phi$: distribución normal estándar.
- $C \le 0.4748$: constante universal.
- $\rho$: tercer momento absoluto centrado.
- $\sigma$: desviación estándar.
- $n$: tamaño de muestra.
:::

:::formula[Tercer momento absoluto de una Bernoulli]
$$
\rho = p(1-p)\big[p^2 + (1-p)^2\big]
$$

- $p$: probabilidad de éxito.
:::

:::formula[Tamaño de muestra para un error máximo]
$$
n \ge \Big(\frac{C\,\rho}{\sigma^3\,\eta}\Big)^2
$$

- $\eta$: error máximo aceptado en la función de distribución.
:::

:::formula[Sumandos no idénticos]
$$
\sup_z \big|F_n(z) - \Phi(z)\big| \le C'\,\frac{\sum_{i=1}^n \rho_i}{s_n^3}
$$

- $\rho_i$: tercer momento absoluto centrado del sumando $i$.
- $s_n^2$: varianza total.
- $C'$: constante universal.
:::
