---
id: ley-debil-de-los-grandes-numeros
titulo: Ley débil de los grandes números
titulo_en: Weak law of large numbers
alias:
  - LDGN
  - ley de los grandes números
  - teorema de Bernoulli
modulo: 3
submodulo: '3.1'
orden: 6
nivel: intermedio
prerrequisitos:
  - convergencia-en-probabilidad
etiquetas:
  - grandes números
  - media muestral
  - promedios
  - consistencia
  - Chebyshev
resumen: >
  Si X₁, X₂, ... son independientes, con la misma distribución y media μ, la media muestral converge en probabilidad a μ:
  la probabilidad de que el promedio se aleje de μ más de cualquier tolerancia tiende a cero.
formula: '\bar{X}_n = \frac{1}{n}\sum_{i=1}^n X_i \xrightarrow{p} \mu, \qquad P\big(|\bar{X}_n - \mu| > \varepsilon\big) \le \frac{\sigma^2}{n\varepsilon^2}'
visualizacion:
  componente: LargeNumbers
  parametros:
    modo: debil
    poblacion: dado
    poblaciones:
      - dado
      - moneda
      - exponencial
      - uniforme
      - pareto
      - cauchy
    epsilon: 0.3
    trayectorias: 60
    horizonte: 1000
referencias:
  - clave: ross-probabilidad
  - clave: blitzstein-hwang
  - clave: wasserman
publicado: true
---

## Intuición

Una aseguradora no sabe cuánto reclamará cada cliente, pero sí cuánto reclaman sus clientes en promedio. Con pocos clientes, un par de siniestros grandes mueve mucho el promedio; con miles, los siniestros grandes y los pequeños se compensan y el promedio por cliente queda muy cerca del valor esperado. Por eso la aseguradora puede fijar una prima casi sin riesgo aunque cada contrato individual sea impredecible.

La ley débil de los grandes números convierte esa experiencia en un teorema: el promedio de muchas observaciones independientes de la misma población se concentra alrededor de la media poblacional. Para cualquier margen de error que se fije, la probabilidad de que el promedio caiga fuera del margen tiende a cero al crecer el número de observaciones. La razón de fondo es que la varianza del promedio es la varianza de una observación dividida entre $n$: el ruido se diluye. El teorema dice "probablemente cerca" en cada $n$ grande; la versión fuerte, más difícil, dice que cada secuencia de promedios termina quedándose cerca para siempre.

## Definición

:::teorema[Ley débil de los grandes números]
Sean $X_1, X_2, \dots$ variables aleatorias independientes e idénticamente distribuidas con $\mathbb{E}[X_i] = \mu$ finita. Entonces la media muestral
$$
\bar{X}_n = \frac{1}{n}\sum_{i=1}^{n} X_i
$$
cumple $\bar{X}_n \xrightarrow{p} \mu$: para todo $\varepsilon > 0$, $\lim_{n \to \infty} P(|\bar{X}_n - \mu| > \varepsilon) = 0$.
:::

Si además $\operatorname{Var}(X_i) = \sigma^2 < \infty$, la desigualdad de Chebyshev da una cota explícita:
$$
P\big(|\bar{X}_n - \mu| > \varepsilon\big) \le \frac{\sigma^2}{n\,\varepsilon^2}.
$$
La versión con varianza finita también vale si las variables solo son no correlacionadas con varianzas acotadas. La versión general, debida a Khinchin, solo pide media finita.

:::nota[Qué significa cada símbolo]
- $X_i$: observación $i$, todas con la misma distribución e independientes.
- $n$: número de observaciones.
- $\bar{X}_n$: media muestral de las primeras $n$ observaciones.
- $\mu = \mathbb{E}[X_i]$: media poblacional.
- $\sigma^2 = \operatorname{Var}(X_i)$: varianza poblacional.
- $\varepsilon$: tolerancia positiva.
- $\xrightarrow{p}$: convergencia en probabilidad.
:::

## Cómo usar la visualización

Arriba, cada trayectoria es la media acumulada $\bar{X}_n$ de una secuencia distinta de observaciones, y la banda es $\mu \pm \varepsilon$. Abajo, la línea continua es la fracción de trayectorias fuera de la banda en cada $n$; las discontinuas son la cota de Chebyshev $\sigma^2/(n\varepsilon^2)$ y la aproximación normal. El selector cambia la población y el control fija $\varepsilon$.

Con el dado y $\varepsilon = 0.3$, la fracción fuera cae mucho antes que la cota de Chebyshev, que es correcta pero conservadora. Con la Pareto de índice 1.5 la varianza es infinita: la cota no aplica y los saltos de las trayectorias son visibles, pero la media acumulada converge de todos modos. Con la Cauchy, que no tiene media, las trayectorias nunca se estabilizan.

## Ejemplo

Los reclamos de los clientes de una aseguradora siguen una distribución exponencial con media $\mu = 1$ (en decenas de miles de pesos) y desviación estándar $\sigma = 1$. Se quiere que el reclamo promedio de $n$ clientes quede a menos de $\varepsilon = 0.1$ de la media con probabilidad de al menos 0.95.

1. Chebyshev: $P(|\bar{X}_n - 1| > 0.1) \le \frac{1}{n \cdot 0.01} = \frac{100}{n}$.
2. Para que la cota sea a lo más 0.05 se necesita $n \ge 2000$ clientes.
3. Con $n = 2000$ la ley débil garantiza el objetivo sin suponer nada más sobre la distribución.
4. La aproximación normal, $2\big(1 - \Phi(0.1\sqrt{n})\big) \le 0.05$, pide $0.1\sqrt{n} \ge 1.96$, es decir, $n \ge 385$.
5. La diferencia muestra el precio de la generalidad: Chebyshev vale para cualquier población con varianza finita, pero sobreestima la probabilidad de error.

:::figura[El ejemplo de la aseguradora: reclamos exponenciales con media 1 y tolerancia 0.1. La fracción de trayectorias fuera de la banda queda muy por debajo de la cota de Chebyshev 100/n.]{componente="LargeNumbers"}
```yaml
modo: debil
poblacion: exponencial
epsilon: 0.1
trayectorias: 80
horizonte: 2000
```
:::

## Propiedades

- **Varianza de la media:** $\operatorname{Var}(\bar{X}_n) = \sigma^2/n$; el error típico decrece como $1/\sqrt{n}$.
- **Tamaño de muestra por Chebyshev:** para garantizar $P(|\bar{X}_n - \mu| > \varepsilon) \le \delta$ basta $n \ge \sigma^2/(\delta\varepsilon^2)$.
- **Frecuencias relativas:** si $X_i = \mathbf{1}\{A_i\}$ indica que ocurre un evento de probabilidad $p$, la frecuencia relativa converge en probabilidad a $p$ (teorema de Bernoulli).
- **Consistencia de momentos muestrales:** $\frac{1}{n}\sum X_i^k \xrightarrow{p} \mathbb{E}[X^k]$ si ese momento existe, y por continuidad la varianza muestral es consistente.
- **Media finita basta:** con varianza infinita, como en la Pareto de índice 1.5, la ley sigue valiendo, aunque la convergencia es más lenta y no la acota Chebyshev.

:::figura[Propiedad: frecuencia relativa de caras. Con tolerancia 0.05 la fracción de trayectorias fuera de la banda baja a medida que crece el número de volados.]{componente="LargeNumbers"}
```yaml
modo: debil
poblacion: moneda
epsilon: 0.05
trayectorias: 80
horizonte: 1500
```
:::

:::figura[Propiedad: media finita y varianza infinita. La Pareto de índice 1.5 tiene media 3; las medias acumuladas convergen, con saltos causados por observaciones enormes.]{componente="LargeNumbers"}
```yaml
modo: debil
poblacion: pareto
epsilon: 0.5
trayectorias: 60
horizonte: 5000
escalaLog: true
```
:::

:::demostracion
Con varianza finita: $\mathbb{E}[\bar{X}_n] = \mu$ y, por independencia, $\operatorname{Var}(\bar{X}_n) = \frac{1}{n^2}\sum_{i=1}^n \operatorname{Var}(X_i) = \frac{\sigma^2}{n}$. Por Chebyshev, $P(|\bar{X}_n - \mu| > \varepsilon) \le \frac{\sigma^2}{n\varepsilon^2} \to 0$.
:::

## Errores comunes

- **Falacia del jugador.** La ley no dice que después de muchas caras vengan cruces para "compensar". Las desviaciones no se corrigen: se diluyen al dividir entre un $n$ cada vez mayor.
- **Creer que la suma se acerca a $n\mu$.** Lo que converge es el promedio. La diferencia $S_n - n\mu$ típicamente crece como $\sqrt{n}$.
- **Aplicarla sin media finita.** El promedio de observaciones Cauchy tiene la misma distribución que una sola observación y no se estabiliza.
- **Usar la cota de Chebyshev como valor exacto.** Es una cota superior y suele ser muy holgada.

:::figura[Error común: sin media no hay ley de los grandes números. Las medias acumuladas de datos Cauchy saltan una y otra vez sin acercarse a ningún valor.]{componente="LargeNumbers"}
```yaml
modo: debil
poblacion: cauchy
epsilon: 0.5
trayectorias: 40
horizonte: 5000
escalaLog: true
```
:::

## Conexiones

Es una afirmación de [[convergencia-en-probabilidad]] sobre la media muestral. Su versión fuerte es la [[ley-fuerte-de-los-grandes-numeros]], y el [[teorema-central-del-limite]] describe las fluctuaciones de tamaño $1/\sqrt{n}$ alrededor de $\mu$. La [[teoria-de-grandes-desviaciones]] mide qué tan rápido decae la probabilidad de un error fijo, y [[cuando-el-tcl-falla]] muestra qué ocurre sin momentos. Con funciones continuas se extiende mediante el [[teorema-del-mapeo-continuo]].

## Formulario

:::formula[Ley débil]
$$
\bar{X}_n = \frac{1}{n}\sum_{i=1}^n X_i \xrightarrow{p} \mu
$$

- $X_i$: observaciones independientes con media $\mu$.
- $n$: número de observaciones.
- $\bar{X}_n$: media muestral.
:::

:::formula[Cota de Chebyshev]
$$
P\big(|\bar{X}_n - \mu| > \varepsilon\big) \le \frac{\sigma^2}{n\,\varepsilon^2}
$$

- $\sigma^2$: varianza de cada observación.
- $\varepsilon$: tolerancia.
:::

:::formula[Varianza de la media muestral]
$$
\operatorname{Var}(\bar{X}_n) = \frac{\sigma^2}{n}
$$

- $\sigma^2$: varianza poblacional.
- $n$: tamaño de muestra.
:::

:::formula[Tamaño de muestra suficiente]
$$
n \ge \frac{\sigma^2}{\delta\,\varepsilon^2}
$$

- $\delta$: probabilidad máxima de error aceptada.
- $\varepsilon$: tolerancia.
- $\sigma^2$: varianza poblacional.
:::

:::formula[Aproximación normal de la probabilidad de error]
$$
P\big(|\bar{X}_n - \mu| > \varepsilon\big) \approx 2\Big(1 - \Phi\Big(\frac{\varepsilon\sqrt{n}}{\sigma}\Big)\Big)
$$

- $\Phi$: función de distribución normal estándar.
- $\sigma$: desviación estándar poblacional.
:::
