---
id: convergencia-en-probabilidad
titulo: Convergencia en probabilidad
titulo_en: Convergence in probability
alias:
  - convergencia estocástica
  - consistencia
modulo: 3
submodulo: '3.1'
orden: 1
nivel: intermedio
prerrequisitos:
  - sucesiones
etiquetas:
  - convergencia
  - variables aleatorias
  - tolerancia
  - consistencia
resumen: >
  Una sucesión de variables aleatorias converge en probabilidad a X si, para cualquier tolerancia, la
  probabilidad de quedar a más de esa distancia de X tiende a cero cuando n crece.
formula: 'X_n \xrightarrow{p} X \iff \lim_{n \to \infty} P\big(|X_n - X| > \varepsilon\big) = 0 \ \ \text{para todo } \varepsilon > 0'
visualizacion:
  componente: ConvergenceViz
  parametros:
    modo: probabilidad
    sucesion: media-moneda
    sucesiones:
      - media-moneda
      - ruido-decreciente
      - maquina-de-escribir
      - signo-alternante
    epsilon: 0.1
referencias:
  - clave: casella-berger
    capitulo: '5.5'
  - clave: wasserman
publicado: true
---

## Intuición

Un laboratorio calibra un termómetro industrial promediando lecturas repetidas de un baño a temperatura fija. Cada lectura trae ruido, pero el promedio de más lecturas se parece más a la temperatura real. Nadie garantiza que el promedio de 100 lecturas esté a menos de 0.2 grados del valor verdadero: puede tocar una racha de errores en la misma dirección. Lo que sí ocurre es que esa mala suerte se vuelve cada vez más improbable.

Eso es la convergencia en probabilidad. Se fija de antemano un margen de error, cualquiera, y se mira la probabilidad de que el término $n$ de la sucesión caiga fuera de ese margen. Si esa probabilidad se va a cero, la sucesión converge en probabilidad. La afirmación es sobre un instante $n$ a la vez: dice que en cada $n$ grande casi todas las realizaciones están cerca del límite, pero no dice que una realización concreta se quede cerca para siempre. Esa diferencia, sutil pero real, separa este modo de la convergencia casi segura.

## Definición

:::definicion[Convergencia en probabilidad]
Sean $X_1, X_2, \dots$ y $X$ variables aleatorias definidas en el mismo espacio de probabilidad. La sucesión **converge en probabilidad** a $X$, y se escribe $X_n \xrightarrow{p} X$, si para todo $\varepsilon > 0$
$$
\lim_{n \to \infty} P\big(|X_n - X| > \varepsilon\big) = 0.
$$
:::

De forma equivalente, $P(|X_n - X| \le \varepsilon) \to 1$. El límite puede ser una constante $c$, caso muy frecuente en estadística: un estimador $\hat{\theta}_n$ es **consistente** para $\theta$ si $\hat{\theta}_n \xrightarrow{p} \theta$. La definición exige que todas las variables vivan en el mismo espacio, porque compara $X_n$ con $X$ realización por realización.

:::nota[Qué significa cada símbolo]
- $X_n$: término $n$ de la sucesión de variables aleatorias.
- $X$: variable límite; puede ser una constante.
- $\varepsilon$: tolerancia, cualquier número positivo.
- $|X_n - X|$: distancia entre el término y el límite, que es aleatoria.
- $P(\cdot)$: probabilidad.
- $\xrightarrow{p}$: "converge en probabilidad a".
- $\hat{\theta}_n$: estimador calculado con $n$ datos; $\theta$, el parámetro que estima.
:::

## Cómo usar la visualización

Arriba se dibujan cien realizaciones de $X_n - X$, cada una como una trayectoria, junto con la banda $\pm\varepsilon$. Abajo, la línea oscura es la fracción de trayectorias que están fuera de la banda en cada $n$ y la discontinua, la probabilidad exacta. El selector cambia la sucesión y el control fija $\varepsilon$.

Con la proporción de caras y $\varepsilon = 0.1$, la fracción fuera de la banda pasa de 0.34 en $n = 10$ a 0.035 en $n = 100$. Al reducir $\varepsilon$ a 0.05 la curva baja más despacio, pero sigue yendo a cero. Con la máquina de escribir todas las trayectorias vuelven a saltar a 1 una y otra vez, y aun así la fracción que está fuera en un $n$ dado se hace pequeña. Con el signo alternante la fracción no baja: esa sucesión no converge en probabilidad.

## Ejemplo

Un termómetro tiene error de medición con desviación estándar de 1 grado y se reporta el promedio de $n$ lecturas: $X_n = \theta + Z_n/\sqrt{n}$ con $Z_n \sim \mathcal{N}(0, 1)$, donde $\theta$ es la temperatura real. Se fija $\varepsilon = 0.2$ grados.

1. La distancia al valor real es $|X_n - \theta| = |Z_n|/\sqrt{n}$.
2. $P(|X_n - \theta| > 0.2) = P(|Z_n| > 0.2\sqrt{n}) = 2\big(1 - \Phi(0.2\sqrt{n})\big)$, donde $\Phi$ es la función de distribución normal estándar.
3. Con $n = 25$: $2(1 - \Phi(1)) = 0.3173$. Con $n = 100$: $2(1 - \Phi(2)) = 0.0455$. Con $n = 400$: $2(1 - \Phi(4)) = 0.00006$.
4. La probabilidad tiende a cero para cualquier $\varepsilon$, porque $\varepsilon\sqrt{n} \to \infty$; por tanto $X_n \xrightarrow{p} \theta$.
5. Para garantizar probabilidad de error menor que 0.01 hace falta $0.2\sqrt{n} \ge 2.576$, es decir, $n \ge 166$ lecturas.

:::figura[El termómetro del ejemplo: medición con ruido que se reduce como 1/√n y tolerancia de 0.2. La fracción de trayectorias fuera de la banda sigue la curva exacta 2(1 - Φ(0.2√n)).]{componente="ConvergenceViz"}
```yaml
modo: probabilidad
sucesion: ruido-decreciente
epsilon: 0.2
trayectorias: 150
horizonte: 400
```
:::

## Propiedades

- **Por la desigualdad de Chebyshev:** si $\mathbb{E}[X_n] = \mu$ y $\operatorname{Var}(X_n) \to 0$, entonces $X_n \xrightarrow{p} \mu$, porque $P(|X_n - \mu| > \varepsilon) \le \operatorname{Var}(X_n)/\varepsilon^2$.
- **Álgebra:** si $X_n \xrightarrow{p} X$ y $Y_n \xrightarrow{p} Y$, entonces $X_n + Y_n \xrightarrow{p} X + Y$ y $X_n Y_n \xrightarrow{p} XY$.
- **Funciones continuas:** si $g$ es continua, $g(X_n) \xrightarrow{p} g(X)$ (teorema del mapeo continuo).
- **Relación con otros modos:** la convergencia casi segura y la convergencia en media cuadrática implican la convergencia en probabilidad, y esta implica la convergencia en distribución.
- **Subsucesiones:** si $X_n \xrightarrow{p} X$, existe una subsucesión $X_{n_k}$ que converge casi seguramente a $X$.

:::figura[Propiedad clave: convergencia en probabilidad sin convergencia trayectoria por trayectoria. Cada realización de la máquina de escribir vuelve a valer 1 en cada bloque, pero en un n fijo solo una fracción 1/k de ellas lo hace.]{componente="ConvergenceViz"}
```yaml
modo: probabilidad
sucesion: maquina-de-escribir
epsilon: 0.5
trayectorias: 40
horizonte: 300
```
:::

:::demostracion
Para la suma: si $|X_n + Y_n - X - Y| > \varepsilon$, entonces $|X_n - X| > \varepsilon/2$ o $|Y_n - Y| > \varepsilon/2$. Por la cota de la unión, $P(|X_n + Y_n - X - Y| > \varepsilon) \le P(|X_n - X| > \varepsilon/2) + P(|Y_n - Y| > \varepsilon/2)$, y ambos sumandos tienden a cero.
:::

## Errores comunes

- **Confundirla con la convergencia de cada trayectoria.** Que la probabilidad de estar lejos en el instante $n$ tienda a cero no impide que cada realización se aleje infinitas veces, como en la máquina de escribir.
- **Creer que basta con que las distribuciones se parezcan.** $X_n = (-1)^n Z$ tiene siempre la misma distribución que $Z$, pero $|X_n - Z| = 2|Z|$ para $n$ impar: no converge en probabilidad a $Z$.
- **Pensar que implica convergencia de las esperanzas.** $X_n = n\,\mathbf{1}\{U < 1/n\}$ converge en probabilidad a 0 y sin embargo $\mathbb{E}[X_n] = 1$ para todo $n$.
- **Olvidar que el límite y la sucesión deben estar en el mismo espacio.** La definición compara valores realización por realización.

:::figura[Error común: la misma distribución no basta. Con Xₙ = (-1)ⁿ Z, en cada n impar una fracción fija de trayectorias queda fuera de la banda y la curva no baja.]{componente="ConvergenceViz"}
```yaml
modo: probabilidad
sucesion: signo-alternante
epsilon: 0.5
trayectorias: 80
horizonte: 200
```
:::

:::figura[Error común: convergencia en probabilidad sin convergencia de la esperanza. El pico n · 1{U < 1/n} desaparece con probabilidad creciente, pero cuando aparece es tan alto que el promedio de los cuadrados crece.]{componente="ConvergenceViz"}
```yaml
modo: media-cuadratica
sucesion: pico-creciente
trayectorias: 200
horizonte: 300
```
:::

## Conexiones

Generaliza a variables aleatorias el límite de [[sucesiones]] de números. Es el modo de la [[ley-debil-de-los-grandes-numeros]] y de la consistencia de estimadores. La [[convergencia-casi-segura]] y la [[convergencia-en-media-cuadratica]] la implican, y ella implica la [[convergencia-en-distribucion]]; el panorama completo está en [[relaciones-entre-modos-de-convergencia]]. Se combina con la convergencia en distribución mediante el [[teorema-de-slutsky]] y se conserva bajo funciones continuas por el [[teorema-del-mapeo-continuo]].

## Formulario

:::formula[Convergencia en probabilidad]
$$
X_n \xrightarrow{p} X \iff \lim_{n \to \infty} P\big(|X_n - X| > \varepsilon\big) = 0\ \ \forall \varepsilon > 0
$$

- $X_n$: término $n$ de la sucesión.
- $X$: límite, variable aleatoria o constante.
- $\varepsilon$: tolerancia positiva arbitraria.
- $P$: probabilidad.
:::

:::formula[Criterio de Chebyshev]
$$
P\big(|X_n - \mu| > \varepsilon\big) \le \frac{\operatorname{Var}(X_n)}{\varepsilon^2}
$$

- $\mu$: esperanza común $\mathbb{E}[X_n]$.
- $\operatorname{Var}(X_n)$: varianza de $X_n$; si tiende a cero, hay convergencia en probabilidad a $\mu$.
- $\varepsilon$: tolerancia.
:::

:::formula[Probabilidad del ejemplo]
$$
P\big(|X_n - \theta| > \varepsilon\big) = 2\big(1 - \Phi(\varepsilon\sqrt{n})\big)
$$

- $X_n = \theta + Z_n/\sqrt{n}$: promedio de $n$ lecturas con error normal de desviación 1.
- $\theta$: valor real medido.
- $\Phi$: función de distribución normal estándar.
- $n$: número de lecturas.
:::

:::formula[Consistencia de un estimador]
$$
\hat{\theta}_n \xrightarrow{p} \theta
$$

- $\hat{\theta}_n$: estimador con $n$ datos.
- $\theta$: parámetro desconocido.
:::
