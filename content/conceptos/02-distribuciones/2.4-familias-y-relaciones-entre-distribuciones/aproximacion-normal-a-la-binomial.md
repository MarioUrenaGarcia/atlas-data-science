---
id: aproximacion-normal-a-la-binomial
titulo: Aproximación normal a la binomial
titulo_en: Normal approximation to the binomial
alias:
  - teorema de De Moivre-Laplace
  - aproximación de De Moivre-Laplace
modulo: 2
submodulo: '2.4'
orden: 8
nivel: intermedio
prerrequisitos:
  - distribucion-binomial
  - normal-estandar-y-puntuacion-z
relaciones:
  - tipo: relacionado
    id: correccion-por-continuidad
  - tipo: contrasta
    id: aproximacion-de-poisson-a-la-binomial
etiquetas:
  - aproximación
  - binomial
  - normal
  - De Moivre-Laplace
  - encuestas
resumen: >
  Con muchos ensayos, la binomial se parece a una normal con la misma media np y la misma varianza
  np(1 - p). Es el caso más antiguo del teorema central del límite.
formula: 'X \sim \operatorname{Bin}(n, p) \;\Rightarrow\; \frac{X - np}{\sqrt{np(1 - p)}} \approx \mathcal{N}(0, 1) \quad (n \text{ grande})'
visualizacion:
  componente: DistributionExplorer
  parametros:
    distribucion: binomial
    valores:
      n: 100
      p: 0.55
    rangos:
      n: [1, 200]
      p: [0.01, 0.99]
      mu: [0, 200]
      sigma: [0.1, 20]
    dominio: [0, 100]
    region: derecha
    desde: 60
    muestras: false
    casos:
      - nombre: 'Encuesta electoral'
        descripcion: 'n = 100 y p = 0.55: np = 55 y n(1 - p) = 45, ambos mayores que 10; las barras siguen de cerca a la campana.'
        valores: {n: 100, p: 0.55}
      - nombre: 'Pocos ensayos sesgados'
        descripcion: 'n = 20 y p = 0.1: np = 2; la binomial es muy asimétrica y la normal le asigna probabilidad a valores negativos.'
        valores: {n: 20, p: 0.1}
      - nombre: 'Control de calidad grande'
        descripcion: 'n = 200 y p = 0.3: np = 60 y n(1 - p) = 140; la aproximación es casi perfecta.'
        valores: {n: 200, p: 0.3}
    referencia:
      distribucion: normal
      enlace:
        mu: {de: [n, p]}
        sigma: {de: [n, p], potencias: [0.5, 0.5], complementos: [p], potenciasComplemento: [0.5]}
      etiqueta: 'Normal con media np y varianza np(1 - p)'
      visible: true
referencias:
  - clave: ross-probabilidad
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una encuesta entrevista a 100 personas y cuenta cuántas apoyan a un candidato. Calcular la probabilidad de que lo apoyen 60 o más exige sumar 41 términos de la binomial, cada uno con un coeficiente binomial enorme. Antes de las computadoras eso era impracticable. A principios del siglo XVIII, De Moivre notó que, con muchos ensayos, el histograma de la binomial tiene forma de campana, y que esa campana es una curva que se puede tabular una sola vez.

La razón es que una binomial es una suma de muchos ensayos de Bernoulli independientes, y las sumas de muchas variables independientes tienden a la normal. Para aproximarla basta elegir la normal con la misma media, $np$, y la misma varianza, $np(1 - p)$. Las probabilidades se calculan estandarizando y usando la tabla de la normal estándar.

La aproximación funciona mejor cuando la binomial es más simétrica y tiene más valores posibles: con $p$ cerca de 1/2 basta con pocas decenas de ensayos; con $p$ cerca de 0 o de 1 hacen falta muchos más, porque la binomial está pegada a un extremo y es asimétrica. Una regla práctica pide que tanto $np$ como $n(1 - p)$ superen 10.

## Definición

:::teorema[De Moivre-Laplace]
Si $X_n \sim \operatorname{Bin}(n, p)$ con $0 < p < 1$ fijo, entonces para todo $z$
$$
P\!\left(\frac{X_n - np}{\sqrt{np(1 - p)}} \le z\right) \to \Phi(z) \qquad (n \to \infty).
$$
:::

En la práctica, para $n$ grande se usa
$$
P(a \le X \le b) \approx \Phi\!\left(\frac{b - np}{\sqrt{np(1 - p)}}\right) - \Phi\!\left(\frac{a - np}{\sqrt{np(1 - p)}}\right),
$$
y la aproximación mejora al ampliar el intervalo media unidad por cada lado (la corrección por continuidad). Se considera adecuada si $np \ge 10$ y $n(1 - p) \ge 10$.

:::nota[Qué es X]
$X$ = el número de éxitos en $n$ ensayos, como cuántas de 100 personas encuestadas apoyan a un candidato.
:::

:::nota[Qué hace cada parámetro]
- **$n$, número de ensayos:** cuántas veces se repite el experimento. Si aumenta, las barras se vuelven más finas en relación con el ancho de la distribución y la campana se ajusta mejor.
- **$p$, probabilidad de éxito:** la proporción de éxitos esperada. Si se acerca a 0 o a 1, la binomial se vuelve asimétrica y la aproximación empeora para el mismo $n$.
:::

:::nota[Qué significa cada símbolo]
- $X_n$: binomial con $n$ ensayos; $p$: probabilidad de éxito.
- $np$: media; $np(1 - p)$: varianza; $\sqrt{np(1 - p)}$: desviación.
- $\Phi$: función de distribución normal estándar; $z$: valor estandarizado.
- $a$, $b$: extremos del intervalo de interés.
:::

## Cómo usar la visualización

Las barras son la binomial y la curva punteada es la normal con su misma media y varianza; la curva sigue a los controles de $n$ y $p$. La región sombreada y su probabilidad exacta están en el panel. Los casos cargan una encuesta electoral, pocos ensayos sesgados y un control de calidad grande.

Con la encuesta, observa que la campana pasa casi por la punta de cada barra. Baja $n$ a 20 con $p = 0.1$ y observa que la normal empieza en valores negativos y no reproduce la asimetría. Sube $n$ de 10 a 200 con $p = 0.3$ y observa cómo mejora el ajuste.

## Ejemplo

En una población, el 55 % apoya a un candidato. Se encuesta a 100 personas al azar; $X \sim \operatorname{Bin}(100, 0.55)$. ¿Qué probabilidad hay de que 60 o más lo apoyen?

1. Media $np = 55$, varianza $np(1 - p) = 24.75$, desviación $\approx 4.975$.
2. Condiciones: $np = 55 \ge 10$ y $n(1 - p) = 45 \ge 10$.
3. Sin corrección: $P(X \ge 60) \approx P\!\left(Z \ge \frac{60 - 55}{4.975}\right) = P(Z \ge 1.005) \approx 0.157$.
4. Con corrección por continuidad: $P(X \ge 59.5)$, es decir, $P(Z \ge 0.905) \approx 0.183$.
5. El valor exacto de la binomial es 0.1831: la aproximación corregida coincide hasta la tercera cifra; la que no corrige se queda corta por 0.026.

:::figura[Encuesta electoral: la región X ≥ 60 de la binomial con n = 100 y p = 0.55 vale 0.1831; la normal punteada con media 55 y desviación 4.97 pasa por las puntas de las barras.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial
valores:
  n: 100
  p: 0.55
rangos:
  n: [1, 200]
  p: [0.01, 0.99]
  mu: [0, 200]
  sigma: [0.1, 20]
dominio: [30, 80]
region: derecha
desde: 60
muestras: false
referencia:
  distribucion: normal
  enlace:
    mu: {de: [n, p]}
    sigma: {de: [n, p], potencias: [0.5, 0.5], complementos: [p], potenciasComplemento: [0.5]}
  etiqueta: Normal con media np y varianza np(1 - p)
  visible: true
```
:::

## Propiedades

- **Momentos iguales:** la normal aproximante tiene la media $np$ y la varianza $np(1 - p)$ de la binomial.
- **Caso del teorema central del límite:** $X = \sum_{i=1}^{n} B_i$ con $B_i$ Bernoulli independientes, y el teorema central se aplica a esa suma.
- **Error:** la cota de Berry-Esseen da un error de la función de distribución de orden $\frac{1}{\sqrt{np(1 - p)}}$; crece cuando $p$ se acerca a 0 o a 1.
- **Asimetría:** la binomial tiene asimetría $\frac{1 - 2p}{\sqrt{np(1 - p)}}$, que la normal ignora; por eso el ajuste es mejor con $p = 1/2$.
- **Proporción:** la proporción muestral $\hat{p} = X/n$ es aproximadamente $\mathcal{N}\big(p, p(1 - p)/n\big)$; en ello se basan los márgenes de error de las encuestas.

:::figura[Casos con contexto (encuesta, pocos ensayos sesgados, control de calidad grande): cada botón carga n y p, y una frase explica qué tan bien se ajusta la campana.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial
valores:
  n: 20
  p: 0.1
rangos:
  n: [1, 200]
  p: [0.01, 0.99]
  mu: [-10, 200]
  sigma: [0.1, 20]
dominio: [-5, 100]
muestras: false
casos:
  - nombre: 'Encuesta electoral'
    descripcion: 'np = 55: ajuste muy bueno.'
    valores: {n: 100, p: 0.55}
  - nombre: 'Pocos ensayos sesgados'
    descripcion: 'np = 2: la normal no ve la asimetría.'
    valores: {n: 20, p: 0.1}
  - nombre: 'Control de calidad grande'
    descripcion: 'np = 60: casi perfecta.'
    valores: {n: 200, p: 0.3}
referencia:
  distribucion: normal
  enlace:
    mu: {de: [n, p]}
    sigma: {de: [n, p], potencias: [0.5, 0.5], complementos: [p], potenciasComplemento: [0.5]}
  etiqueta: Normal con media np y varianza np(1 - p)
  visible: true
```
:::

:::figura[La corrección en el ejemplo: con n = 100 y p = 0.55, el área normal desde 59.5 recupera la mitad de la barra del 60 que el área desde 60 deja fuera.]{componente="FamilyLab"}
```yaml
modo: continuidad
valores:
  n: 100
  p: 0.55
  a: 60
  b: 100
```
:::

## Errores comunes

- **Aplicarla con $np$ chico.** Con $n = 20$ y $p = 0.1$, la binomial es asimétrica y la normal da probabilidad positiva a valores negativos; ahí conviene la aproximación de Poisson o el cálculo exacto.
- **Olvidar la corrección por continuidad.** Con $n$ moderado, calcular $P(X \ge 60)$ con el umbral 60 en lugar de 59.5 subestima la probabilidad.
- **Usar $\sqrt{np}$ como desviación.** La desviación es $\sqrt{np(1 - p)}$; con $p = 0.55$ omitir el factor $1 - p$ la infla un 49 %.
- **Aproximar probabilidades de un solo valor sin ancho.** $P(X = 60)$ se aproxima con el área de 59.5 a 60.5, no con la altura de la densidad ni con cero.

:::figura[Pocos ensayos sesgados: con n = 20 y p = 0.1 la binomial concentra su masa en 0, 1, 2 y 3, y la normal punteada se extiende a valores negativos.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial
valores:
  n: 20
  p: 0.1
rangos:
  n: [1, 200]
  p: [0.01, 0.99]
  mu: [-10, 200]
  sigma: [0.1, 20]
dominio: [-4, 9]
muestras: false
referencia:
  distribucion: normal
  enlace:
    mu: {de: [n, p]}
    sigma: {de: [n, p], potencias: [0.5, 0.5], complementos: [p], potenciasComplemento: [0.5]}
  etiqueta: Normal con media np y varianza np(1 - p)
  visible: true
```
:::

## Conexiones

Aproxima la [[distribucion-binomial]] con la [[distribucion-normal]] estandarizando como en la [[normal-estandar-y-puntuacion-z]]. Es el primer caso histórico del [[teorema-central-del-limite]] y se mejora con la [[correccion-por-continuidad]]. Cuando $p$ es pequeña y $np$ moderado, la alternativa es la [[aproximacion-de-poisson-a-la-binomial]]. El [[mapa-de-relaciones-entre-distribuciones]] reúne estas aproximaciones.

## Formulario

:::formula[Estandarización]
$$
Z = \frac{X - np}{\sqrt{np(1 - p)}} \approx \mathcal{N}(0, 1)
$$

- $X$: número de éxitos; $n$: ensayos; $p$: probabilidad de éxito.
:::

:::formula[Probabilidad de un intervalo]
$$
P(a \le X \le b) \approx \Phi\!\left(\frac{b + 0.5 - np}{\sqrt{np(1 - p)}}\right) - \Phi\!\left(\frac{a - 0.5 - np}{\sqrt{np(1 - p)}}\right)
$$

- $a$, $b$: extremos enteros; $\pm 0.5$: corrección por continuidad; $\Phi$: normal estándar.
:::

:::formula[Condición práctica]
$$
np \ge 10 \quad \text{y} \quad n(1 - p) \ge 10
$$

- Asegura suficiente simetría para que la campana se ajuste.
:::

:::formula[Proporción muestral]
$$
\hat{p} = \frac{X}{n} \approx \mathcal{N}\!\left(p,\ \frac{p(1 - p)}{n}\right)
$$

- $\hat{p}$: proporción observada.
:::

:::formula[Asimetría de la binomial]
$$
\gamma_1 = \frac{1 - 2p}{\sqrt{np(1 - p)}}
$$

- $\gamma_1$: coeficiente de asimetría; se anula con $p = 1/2$.
:::
