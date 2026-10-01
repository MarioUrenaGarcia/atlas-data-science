---
id: teoria-de-grandes-desviaciones
titulo: Teoría de grandes desviaciones (teorema de Cramér)
titulo_en: Large deviations theory (Cramér's theorem)
alias:
  - teorema de Cramér
  - función de tasa
  - principio de grandes desviaciones
modulo: 3
submodulo: '3.1'
orden: 24
nivel: avanzado
prerrequisitos:
  - teorema-central-del-limite
etiquetas:
  - eventos raros
  - función de tasa
  - transformada de Legendre
  - cota de Chernoff
  - colas exponenciales
resumen: >
  La probabilidad de que la media muestral se aleje una distancia fija de μ decae exponencialmente:
  P(X̄ₙ ≥ a) ≈ e^(-n I(a)), con una función de tasa I que la aproximación normal no reproduce lejos de μ.
formula: '\lim_{n \to \infty} \frac{1}{n}\log P\big(\bar{X}_n \ge a\big) = -I(a), \qquad I(a) = \sup_{\theta \in \mathbb{R}} \big[\theta a - \Lambda(\theta)\big],\ \ \Lambda(\theta) = \log \mathbb{E}\big[e^{\theta X}\big]'
visualizacion:
  componente: LargeNumbers
  parametros:
    modo: grandes-desviaciones
    poblacion: bernoulli
    poblaciones:
      - bernoulli
      - normal
      - exponencial
      - poisson
    a: 0.5
    nMaximo: 150
referencias:
  - clave: durrett
  - clave: cover-thomas
publicado: true
---

## Intuición

Una empresa vende un electrodoméstico y el 30 % de las unidades genera una reclamación de garantía. En un lote de 100 unidades, ¿qué tan probable es que la mitad o más genere reclamaciones? La ley de los grandes números dice que es improbable y el teorema central del límite da una estimación, pero esa estimación se basa en la forma de la campana cerca del centro, no en su cola lejana. Para eventos raros, de los que dependen el diseño de reservas, la confiabilidad de sistemas o la seguridad de códigos de comunicación, hace falta otra herramienta.

La teoría de grandes desviaciones estudia esas probabilidades. El teorema de Cramér dice que la probabilidad de que la media se aleje una distancia fija de su valor esperado decae como una exponencial en $n$, con una tasa $I(a)$ que depende de la población completa a través de su función generadora de momentos. Cerca de la media, $I$ se parece a la parábola $(a - \mu)^2/(2\sigma^2)$ que predice la normal; lejos de ella, la diferencia entre ambas, multiplicada por $n$ en el exponente, produce errores de varios órdenes de magnitud. La intuición es que el evento raro ocurre de la forma "menos rara posible", y la función de tasa mide el costo de esa forma.

## Definición

Sea $X$ una variable con media $\mu$ cuya función generadora de cumulantes $\Lambda(\theta) = \log \mathbb{E}[e^{\theta X}]$ es finita en un entorno de 0. Su **función de tasa** es la transformada de Legendre
$$
I(x) = \sup_{\theta \in \mathbb{R}}\big[\theta x - \Lambda(\theta)\big].
$$

:::teorema[Teorema de Cramér]
Si $X_1, X_2, \dots$ son independientes con la misma distribución que $X$, para todo $a > \mu$
$$
\lim_{n \to \infty}\frac{1}{n}\log P\big(\bar{X}_n \ge a\big) = -I(a),
$$
y análogamente para $a < \mu$ con $P(\bar{X}_n \le a)$.
:::

Además vale la **cota de Chernoff** para todo $n$, no solo en el límite: $P(\bar{X}_n \ge a) \le e^{-nI(a)}$ si $a > \mu$. La función $I$ es convexa, no negativa y vale 0 exactamente en $x = \mu$.

:::nota[Qué significa cada símbolo]
- $X_i$: observaciones independientes con la misma distribución; $\bar{X}_n$, su media.
- $\mu$: media de $X$.
- $a$: umbral, fijo, distinto de $\mu$.
- $\Lambda(\theta) = \log\mathbb{E}[e^{\theta X}]$: función generadora de cumulantes, el logaritmo de la generadora de momentos.
- $\theta$: parámetro real de la transformada.
- $I(x)$: función de tasa, el costo exponencial de que la media valga cerca de $x$.
- $\sup_\theta$: supremo sobre todos los valores reales de $\theta$.
:::

## Cómo usar la visualización

El panel superior grafica, en escala logarítmica y en función de $n$, la probabilidad exacta $P(\bar{X}_n \ge a)$, la cota de Chernoff $e^{-nI(a)}$ y la aproximación normal. Abajo a la izquierda, la tasa observada $-\frac{1}{n}\log P$ converge a $I(a)$, mientras la tasa que sugiere la normal queda en otro nivel; a la derecha, la función $I$ con el punto $a$ y la parábola de la aproximación normal. Los controles fijan la población, el umbral y $n$.

Con la Bernoulli de $p = 0.3$ y $a = 0.5$, la probabilidad exacta cae como una recta en escala logarítmica, siempre por debajo de la cota de Chernoff, y la normal la subestima cada vez más. Al acercar $a$ a $\mu$ la función de tasa y la parábola casi coinciden. Con la población normal ambas curvas son idénticas, porque su función de tasa es exactamente cuadrática.

## Ejemplo

El 30 % de las unidades vendidas genera una reclamación de garantía, de forma independiente. Se busca $P(\bar{X}_{100} \ge 0.5)$, la probabilidad de que la mitad o más de un lote de 100 unidades reclame.

1. Para $X \sim \operatorname{Bernoulli}(0.3)$: $\Lambda(\theta) = \log(0.7 + 0.3e^{\theta})$.
2. El supremo se alcanza donde $\Lambda'(\theta) = a$, en $\theta^* = \log\frac{a(1-p)}{(1-a)p} = \log\frac{0.35}{0.15} = 0.847$, y da $I(a) = a\log\frac{a}{p} + (1 - a)\log\frac{1 - a}{1 - p} = 0.5\log\frac{5}{3} + 0.5\log\frac{5}{7} = 0.0872$.
3. Cota de Chernoff: $P \le e^{-100 \cdot 0.0872} = 1.6 \times 10^{-4}$.
4. Valor exacto con la binomial: $2.2 \times 10^{-5}$. La tasa observada es $-\frac{1}{100}\log P = 0.107$, que se acerca a 0.0872 al crecer $n$.
5. La aproximación normal da $1 - \Phi\big(\frac{0.2}{\sqrt{0.21/100}}\big) = 1 - \Phi(4.36) = 6.4 \times 10^{-6}$: subestima el riesgo en un factor de 3.5, y el factor crece con $n$.

:::figura[El ejemplo de las garantías: Bernoulli con p = 0.3 y umbral a = 0.5. La probabilidad exacta queda bajo la cota de Chernoff y por encima de la aproximación normal.]{componente="LargeNumbers"}
```yaml
modo: grandes-desviaciones
poblacion: bernoulli
a: 0.5
nMaximo: 150
```
:::

## Propiedades

- **Cerca de la media:** $I(x) \approx \frac{(x - \mu)^2}{2\sigma^2}$, lo que conecta con el teorema central del límite para desviaciones pequeñas.
- **Bernoulli y entropía relativa:** $I(a) = D\big(\operatorname{Bern}(a)\,\|\,\operatorname{Bern}(p)\big)$, la divergencia de Kullback-Leibler entre las dos distribuciones de Bernoulli.
- **Funciones de tasa conocidas:** normal, $\frac{(x - \mu)^2}{2\sigma^2}$; exponencial de media 1, $x - 1 - \log x$; Poisson de media $\lambda$, $x\log\frac{x}{\lambda} - x + \lambda$.
- **Inclinación exponencial:** el evento raro ocurre típicamente como si los datos vinieran de la distribución inclinada con densidad proporcional a $e^{\theta^* x}f(x)$, cuya media es $a$. Esto guía el muestreo por importancia para simular eventos raros.
- **Requiere colas ligeras:** si la generadora de momentos no existe, como en distribuciones de colas pesadas, el decaimiento no es exponencial.

:::figura[Propiedad: para la normal la función de tasa es exactamente cuadrática, así que la parábola de la aproximación normal coincide con I.]{componente="LargeNumbers"}
```yaml
modo: grandes-desviaciones
poblacion: normal
a: 1
nMaximo: 100
```
:::

:::figura[Propiedad: con la exponencial la función de tasa x - 1 - log x crece linealmente a la derecha, mucho más despacio que la parábola, y la aproximación normal subestima la cola por muchos órdenes de magnitud.]{componente="LargeNumbers"}
```yaml
modo: grandes-desviaciones
poblacion: exponencial
a: 2
nMaximo: 100
```
:::

:::demostracion
Cota de Chernoff: para $\theta > 0$, por Markov, $P(\bar{X}_n \ge a) = P(e^{\theta S_n} \ge e^{n\theta a}) \le e^{-n\theta a}\,\mathbb{E}[e^{\theta S_n}] = e^{-n(\theta a - \Lambda(\theta))}$, usando la independencia. Minimizar sobre $\theta$ da $e^{-nI(a)}$. La cota inferior se obtiene cambiando a la distribución inclinada, bajo la cual el evento deja de ser raro.
:::

## Errores comunes

- **Usar la normal para eventos raros.** La aproximación normal tiene error absoluto pequeño, pero su error relativo en las colas lejanas puede ser enorme.
- **Leer $e^{-nI(a)}$ como el valor exacto.** El teorema fija el exponente; el valor exacto incluye un factor de orden $1/\sqrt{n}$ que la cota de Chernoff no captura.
- **Aplicarlo con colas pesadas.** Si $\mathbb{E}[e^{\theta X}] = \infty$ para todo $\theta > 0$, la probabilidad decae más lento que cualquier exponencial.
- **Confundir la tasa con una probabilidad.** $I(a)$ es un exponente por observación; con $I = 0.087$ y $n = 100$ el factor es $e^{-8.7}$.

:::figura[Error común: confiar en la normal lejos de la media. Con Poisson de media 2 y umbral a = 4, la normal subestima la probabilidad por varios órdenes de magnitud.]{componente="LargeNumbers"}
```yaml
modo: grandes-desviaciones
poblacion: poisson
a: 4
nMaximo: 100
```
:::

## Conexiones

Refina la [[ley-debil-de-los-grandes-numeros]], que solo dice que la probabilidad de una desviación fija tiende a cero, y complementa al [[teorema-central-del-limite]], que describe desviaciones de orden $1/\sqrt{n}$. La transformada de Legendre que define $I$ es una herramienta de [[funciones-convexas-y-concavas|funciones convexas]], y en el caso de Bernoulli la función de tasa es una entropía relativa. [[cuando-el-tcl-falla]] muestra el régimen de colas pesadas donde el decaimiento exponencial no existe.

## Formulario

:::formula[Teorema de Cramér]
$$
\lim_{n \to \infty}\frac{1}{n}\log P\big(\bar{X}_n \ge a\big) = -I(a),\quad a > \mu
$$

- $\bar{X}_n$: media de $n$ observaciones independientes.
- $a$: umbral mayor que la media $\mu$.
- $I$: función de tasa.
:::

:::formula[Función de tasa]
$$
I(x) = \sup_{\theta}\big[\theta x - \Lambda(\theta)\big],\qquad \Lambda(\theta) = \log\mathbb{E}\big[e^{\theta X}\big]
$$

- $\Lambda$: función generadora de cumulantes.
- $\theta$: parámetro de inclinación.
:::

:::formula[Cota de Chernoff]
$$
P\big(\bar{X}_n \ge a\big) \le e^{-n I(a)}
$$

- Válida para todo $n$ cuando $a > \mu$.
:::

:::formula[Función de tasa de Bernoulli]
$$
I(a) = a\log\frac{a}{p} + (1 - a)\log\frac{1 - a}{1 - p}
$$

- $p$: probabilidad de éxito.
- $a$: proporción umbral, entre 0 y 1.
:::

:::formula[Aproximación cuadrática cerca de la media]
$$
I(x) \approx \frac{(x - \mu)^2}{2\sigma^2}
$$

- $\sigma^2$: varianza de $X$.
:::

:::formula[Otras funciones de tasa]
$$
\text{Normal: } \frac{(x - \mu)^2}{2\sigma^2},\qquad \text{Exp}(1): x - 1 - \log x,\qquad \text{Poisson}(\lambda): x\log\frac{x}{\lambda} - x + \lambda
$$

- $\lambda$: media de la Poisson.
:::
