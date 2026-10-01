---
id: teorema-de-glivenko-cantelli
titulo: Teorema de Glivenko-Cantelli
titulo_en: Glivenko-Cantelli theorem
alias:
  - teorema fundamental de la estadística
  - convergencia uniforme de la distribución empírica
modulo: 3
submodulo: '3.1'
orden: 22
nivel: intermedio
prerrequisitos:
  - ley-fuerte-de-los-grandes-numeros
etiquetas:
  - distribución empírica
  - convergencia uniforme
  - Kolmogorov-Smirnov
  - estadística no paramétrica
resumen: >
  La función de distribución empírica de una muestra independiente converge a la verdadera uniformemente
  en x con probabilidad 1: la mayor distancia vertical entre ambas tiende a cero.
formula: 'D_n = \sup_{x \in \mathbb{R}} \big|F_n(x) - F(x)\big| \xrightarrow{c.s.} 0, \qquad F_n(x) = \frac{1}{n}\sum_{i=1}^n \mathbf{1}\{X_i \le x\}'
visualizacion:
  componente: EmpiricalProcessViz
  parametros:
    modo: glivenko-cantelli
    poblacion:
      distribucion: normal
    poblaciones:
      - normal
      - exponencial
      - beta
      - lognormal
      - uniforme
    horizonte: 2000
referencias:
  - clave: wasserman
  - clave: casella-berger
publicado: true
---

## Intuición

Una universidad mide la estatura de una muestra de estudiantes y construye la función de distribución empírica: para cada altura $x$, la fracción de estudiantes que miden a lo más $x$. Es una escalera que sube $1/n$ en cada dato. Si la muestra crece, esa escalera se parece cada vez más a la curva de la distribución de estaturas de toda la población.

Para un valor fijo de $x$, eso es la ley de los grandes números: la fracción de datos por debajo de $x$ converge a la probabilidad de estar por debajo de $x$. El teorema de Glivenko-Cantelli dice algo más fuerte: la convergencia es simultánea para todos los $x$ a la vez, de modo que la mayor diferencia vertical entre la escalera y la curva va a cero. Por eso se le ha llamado teorema fundamental de la estadística: garantiza que una muestra grande revela la distribución completa, sin suponer ninguna forma paramétrica. La desigualdad de Dvoretzky-Kiefer-Wolfowitz añade cuán rápido ocurre, con una cota que no depende de la población.

## Definición

Para una muestra $X_1, \dots, X_n$ se define la **función de distribución empírica**
$$
F_n(x) = \frac{1}{n}\sum_{i=1}^{n}\mathbf{1}\{X_i \le x\}.
$$

:::teorema[Glivenko-Cantelli]
Si $X_1, X_2, \dots$ son independientes con función de distribución común $F$, entonces
$$
D_n = \sup_{x \in \mathbb{R}}\big|F_n(x) - F(x)\big| \xrightarrow{c.s.} 0.
$$
:::

:::teorema[Desigualdad de Dvoretzky-Kiefer-Wolfowitz]
Para todo $n$ y todo $\varepsilon > 0$, $P(D_n > \varepsilon) \le 2e^{-2n\varepsilon^2}$, con la constante 2 hallada por Massart.
:::

El teorema vale para cualquier $F$, continua o no. Si $F$ es continua, la distribución de $D_n$ no depende de $F$, lo que permite usar $D_n$ como estadístico de la prueba de Kolmogorov-Smirnov.

:::nota[Qué significa cada símbolo]
- $X_i$: observaciones independientes con distribución $F$.
- $F_n(x)$: función de distribución empírica, la fracción de observaciones menores o iguales que $x$.
- $\mathbf{1}\{X_i \le x\}$: indicadora, 1 si la observación no supera $x$.
- $F(x)$: función de distribución verdadera.
- $D_n$: mayor diferencia vertical entre $F_n$ y $F$, la distancia de Kolmogorov-Smirnov.
- $\sup_x$: supremo sobre todos los valores reales.
- $\varepsilon$: tolerancia positiva.
:::

## Cómo usar la visualización

La muestra crece de una en una observación, con la escala de $n$ geométrica. Arriba, la escalera de $F_n$ se compara con la curva $F$ y un segmento marca la mayor distancia $D_n$; para muestras pequeñas, marcas en el eje señalan las observaciones. Abajo, en ejes logarítmicos, se grafica $D_n$ de esta muestra, el promedio de $D_n$ en 20 muestras y la referencia $0.87/\sqrt{n}$.

Con la normal, $D_n$ ronda 0.3 con 10 datos y 0.02 con 2000; en la escala logarítmica cae como una recta de pendiente $-1/2$. Al cambiar a la exponencial o a la beta el comportamiento de $D_n$ es idéntico: su distribución no depende de la población. La cantidad $\sqrt{n}\,D_n$ se mantiene alrededor de 0.87.

## Ejemplo

Se mide la estatura de $n = 1000$ estudiantes y se quiere saber qué tan cerca está la distribución empírica de la verdadera.

1. Por la desigualdad de Dvoretzky-Kiefer-Wolfowitz con $\varepsilon = 0.05$: $P(D_{1000} > 0.05) \le 2e^{-2 \cdot 1000 \cdot 0.0025} = 2e^{-5} = 0.0135$.
2. Con probabilidad mayor que 0.98, para toda estatura $x$, la proporción de la muestra por debajo de $x$ difiere de la proporción poblacional en menos de 5 puntos porcentuales.
3. Esto da una banda de confianza no paramétrica: $F_n(x) \pm \varepsilon$ con $\varepsilon = \sqrt{\log(2/\delta)/(2n)}$. Para $\delta = 0.05$ y $n = 1000$, $\varepsilon = \sqrt{3.689/2000} = 0.043$.
4. Para garantizar $\varepsilon = 0.02$ con $\delta = 0.05$ hacen falta $n \ge \frac{\log(2/0.05)}{2 \cdot 0.02^2} = \frac{3.689}{0.0008} = 4611$ estudiantes.
5. Ninguno de estos cálculos usó la forma de la distribución de estaturas.

:::figura[El ejemplo de las estaturas con una población normal: la escalera empírica se pega a la curva y Dₙ sigue la recta 0.87/√n en escala logarítmica.]{componente="EmpiricalProcessViz"}
```yaml
modo: glivenko-cantelli
poblacion:
  distribucion: normal
  valores:
    mu: 0
    sigma: 1
horizonte: 1000
```
:::

## Propiedades

- **Punto a punto es la ley fuerte:** para cada $x$, $F_n(x)$ es una media de indicadoras Bernoulli de parámetro $F(x)$, así que $F_n(x) \xrightarrow{c.s.} F(x)$ y $\operatorname{Var}(F_n(x)) = F(x)(1 - F(x))/n$.
- **Libre de distribución:** si $F$ es continua, $D_n$ tiene la misma ley que para la uniforme en $[0, 1]$, porque $F(X_i)$ es uniforme.
- **Velocidad:** $\sqrt{n}\,D_n$ converge en distribución a la ley de Kolmogorov, con media $\sqrt{\pi/2}\log 2 \approx 0.869$.
- **Banda de confianza DKW:** $F_n \pm \sqrt{\log(2/\delta)/(2n)}$ contiene a $F$ completa con probabilidad al menos $1 - \delta$.
- **Consistencia de funcionales:** cuantiles, mediana y otros funcionales continuos de $F_n$ convergen a los de $F$.

:::figura[Propiedad: libre de distribución. Con una población exponencial el comportamiento de Dₙ es el mismo que con la normal.]{componente="EmpiricalProcessViz"}
```yaml
modo: glivenko-cantelli
poblacion:
  distribucion: exponencial
horizonte: 2000
```
:::

:::figura[Propiedad: la escala √n. Los procesos √n(Fₙ(u) - u) no se encogen al aumentar n; su máximo sigue la distribución de Kolmogorov.]{componente="EmpiricalProcessViz"}
```yaml
modo: donsker-empirico
n: 500
```
:::

:::demostracion
Idea para $F$ continua: se eligen puntos $x_1 < \cdots < x_{k-1}$ con $F(x_j) = j/k$. Por la ley fuerte, casi seguramente $F_n(x_j) \to F(x_j)$ para todos los $j$ a la vez. Para $x$ entre $x_{j-1}$ y $x_j$, la monotonía de $F_n$ y $F$ da $|F_n(x) - F(x)| \le \max_j |F_n(x_j) - F(x_j)| + 1/k$. Entonces $\limsup_n D_n \le 1/k$ para todo $k$, y por tanto $D_n \to 0$.
:::

## Errores comunes

- **Confundir convergencia puntual con uniforme.** La ley de los grandes números da convergencia en cada $x$; el teorema asegura que la peor diferencia también tiende a cero, lo que no es automático.
- **Usar las tablas de Kolmogorov-Smirnov con parámetros estimados.** Si $F$ se ajusta con los mismos datos, la distribución de $D_n$ cambia y la prueba se vuelve conservadora.
- **Esperar que la distancia baje como $1/n$.** Baja como $1/\sqrt{n}$: para dividir el error entre 10 hacen falta 100 veces más datos.
- **Olvidar la independencia.** Con datos dependientes, como series de tiempo, la convergencia puede ser mucho más lenta.

:::figura[Error común: confundir la escala. Con pocas observaciones de una población beta la escalera está todavía lejos de la curva, y Dₙ baja solo como 1/√n.]{componente="EmpiricalProcessViz"}
```yaml
modo: glivenko-cantelli
poblacion:
  distribucion: beta
horizonte: 200
```
:::

## Conexiones

Extiende la [[ley-fuerte-de-los-grandes-numeros]] a toda la función de distribución, con [[convergencia-casi-segura]] uniforme. El [[teorema-de-donsker]] describe las fluctuaciones de tamaño $1/\sqrt{n}$ que quedan, y de ahí sale la prueba de Kolmogorov-Smirnov. Es el fundamento del bootstrap, que muestrea de $F_n$ como sustituto de $F$, y usa la [[funcion-indicadora-y-funcion-escalon|función indicadora]] para construir la escalera empírica.

## Formulario

:::formula[Distribución empírica]
$$
F_n(x) = \frac{1}{n}\sum_{i=1}^{n}\mathbf{1}\{X_i \le x\}
$$

- $X_i$: observaciones.
- $\mathbf{1}\{\cdot\}$: indicadora.
- $n$: tamaño de muestra.
:::

:::formula[Glivenko-Cantelli]
$$
D_n = \sup_{x}\big|F_n(x) - F(x)\big| \xrightarrow{c.s.} 0
$$

- $F$: distribución verdadera.
- $D_n$: distancia de Kolmogorov-Smirnov.
:::

:::formula[Desigualdad DKW]
$$
P(D_n > \varepsilon) \le 2e^{-2n\varepsilon^2}
$$

- $\varepsilon$: tolerancia.
:::

:::formula[Banda de confianza no paramétrica]
$$
F_n(x) \pm \sqrt{\frac{\log(2/\delta)}{2n}}
$$

- $\delta$: probabilidad de que la banda no contenga a $F$.
:::

:::formula[Varianza puntual]
$$
\operatorname{Var}\big(F_n(x)\big) = \frac{F(x)\big(1 - F(x)\big)}{n}
$$

- Máxima en la mediana, donde $F(x) = 1/2$.
:::
