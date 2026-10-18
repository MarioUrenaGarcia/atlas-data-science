---
id: distribucion-empirica
titulo: Distribución empírica
titulo_en: Empirical distribution
alias:
  - función de distribución empírica
  - distribución empírica acumulada
  - ECDF
modulo: 2
submodulo: '2.4'
orden: 13
nivel: intermedio
prerrequisitos:
  - distribucion-uniforme-discreta
  - funcion-indicadora-y-funcion-escalon
relaciones:
  - tipo: relacionado
    id: distribuciones-de-colas-pesadas
etiquetas:
  - datos
  - función de distribución
  - escalera
  - no paramétrica
  - remuestreo
resumen: >
  Distribución que asigna probabilidad 1/n a cada una de las n observaciones. Su función de distribución
  es una escalera que sube 1/n en cada dato y se acerca a la verdadera cuando n crece.
formula: 'F_n(x) = \frac{1}{n}\sum_{i=1}^{n} \mathbf{1}\{X_i \le x\}'
visualizacion:
  componente: FamilyLab
  parametros:
    modo: empirica
    poblacion: exponencial
    valores:
      x: 1
    casos:
      - nombre: 'Tiempos entre llamadas'
        descripcion: 'Población exponencial: con 10 datos la escalera se separa bastante de la curva; reproduce para ver cómo se acerca.'
        valores: {x: 1}
      - nombre: 'Leer la mediana'
        descripcion: 'En x = 0.69, la mediana de la exponencial de tasa 1, la escalera debería rondar 0.5.'
        valores: {x: 0.69}
      - nombre: 'Cola derecha'
        descripcion: 'En x = 3, F(3) = 0.95: con pocos datos la escalera puede valer 1 porque ninguna observación supera 3.'
        valores: {x: 3}
referencias:
  - clave: wasserman
  - clave: hastie-esl
publicado: true
---

## Intuición

Se registran los tiempos entre llamadas en un centro de atención y se obtienen unos cuantos valores. Sin suponer ningún modelo, la descripción más honesta de esos datos es repartir la probabilidad por igual entre ellos: cada tiempo observado recibe un peso de uno entre el número de observaciones. Esa es la distribución empírica.

Su función de distribución acumulada es una escalera: vale cero a la izquierda del dato más chico, sube un escalón de altura $1/n$ en cada observación y llega a uno en la más grande. En cualquier punto $x$, la escalera dice qué fracción de los datos es menor o igual que $x$. Si dos datos coinciden, el escalón es doble.

La distribución empírica es una estimación de la verdadera: cuantos más datos hay, más finos son los escalones y más se pega la escalera a la curva teórica. Es la base de los métodos no paramétricos: la prueba de Kolmogorov-Smirnov compara la escalera con una curva propuesta, el bootstrap remuestrea de ella y muchos estimadores se definen como "la misma cantidad, pero calculada con la distribución empírica".

## Definición

:::definicion[Distribución empírica]
Dadas observaciones $X_1, \dots, X_n$, la **distribución empírica** es la distribución discreta que asigna probabilidad $1/n$ a cada observación (sumando los pesos de valores repetidos). Su **función de distribución empírica** es
$$
F_n(x) = \frac{1}{n}\sum_{i=1}^{n} \mathbf{1}\{X_i \le x\}.
$$
Si los $X_i$ son independientes con función de distribución $F$, la distancia de Kolmogorov es $D_n = \sup_x |F_n(x) - F(x)|$.
:::

:::nota[Qué es X]
$X$ = una observación tomada al azar de la muestra, con probabilidad $1/n$ para cada dato, por ejemplo uno de los tiempos entre llamadas registrados.
:::

:::nota[Qué hace cada parámetro]
- **$n$, tamaño de muestra:** cuántos datos hay. Si aumenta, los escalones se hacen más chicos y $D_n$ baja como $1/\sqrt{n}$.
- **$x$, punto de lectura:** dónde se evalúa la escalera. Si aumenta, $F_n(x)$ sube en escalones mientras $F(x)$ sube de forma continua.
:::

:::nota[Qué significa cada símbolo]
- $X_1, \dots, X_n$: observaciones; $n$: tamaño de muestra.
- $F_n$: función de distribución empírica; $F$: función de distribución verdadera.
- $\mathbf{1}\{X_i \le x\}$: indicadora, vale 1 si la observación no supera $x$.
- $D_n$: distancia de Kolmogorov; $\sup_x$: máximo sobre todos los valores de $x$.
:::

## Cómo usar la visualización

La escalera es $F_n$ y la curva punteada es la verdadera $F$; los puntos sobre el eje son las observaciones. La línea vertical marca el punto de lectura, y el panel da $F_n(x)$, $F(x)$, la distancia máxima $D_n$ y la escala $1/\sqrt{n}$. La reproducción agrega observaciones una por una y el botón agrega 50. El selector cambia la población.

Reproduce desde 10 datos y observa que cada nuevo dato agrega un escalón y que la escalera se acerca a la curva. Agrega 500 datos y compara $D_n$ con $1/\sqrt{n}$. Cambia a la población uniforme y observa que la curva verdadera es una recta.

## Ejemplo

Se registran cinco tiempos entre llamadas, en minutos: 2.1, 3.4, 1.7, 5.0 y 3.4.

1. Ordenados: 1.7, 2.1, 3.4, 3.4, 5.0. Cada uno pesa $1/5 = 0.2$; el valor repetido 3.4 pesa 0.4.
2. $F_5(1.5) = 0$, porque ningún dato es menor o igual que 1.5.
3. $F_5(3) = 2/5 = 0.4$: dos datos (1.7 y 2.1) no superan 3.
4. $F_5(3.4) = 4/5 = 0.8$: en 3.4 la escalera sube un escalón doble, de 0.4 a 0.8.
5. La media de la distribución empírica es la media muestral, $\frac{1.7 + 2.1 + 3.4 + 3.4 + 5.0}{5} = 3.12$.

:::figura[Tiempos entre llamadas: con una población exponencial y pocos datos, la escalera F_n se separa de la curva punteada; la reproducción agrega datos y la acerca.]{componente="FamilyLab"}
```yaml
modo: empirica
poblacion: exponencial
valores:
  x: 1
```
:::

## Propiedades

- **Insesgada en cada punto:** $nF_n(x) \sim \operatorname{Bin}(n, F(x))$, así que $\mathbb{E}[F_n(x)] = F(x)$ y $\operatorname{Var}(F_n(x)) = \frac{F(x)(1 - F(x))}{n}$.
- **Convergencia uniforme:** por el teorema de Glivenko-Cantelli, $D_n \to 0$ casi seguramente.
- **Velocidad:** $\sqrt{n}\,D_n$ tiene una distribución límite que no depende de $F$ (si $F$ es continua), la de Kolmogorov; por eso $D_n$ es del orden de $1/\sqrt{n}$.
- **Desigualdad DKW:** $P(D_n > \varepsilon) \le 2e^{-2n\varepsilon^{2}}$ para todo $n$.
- **Estimadores de enchufe:** media, varianza, cuantiles y otros funcionales calculados con $F_n$ son los estimadores muestrales.
- **Remuestreo:** sacar datos de $F_n$ con reemplazo es el bootstrap.

:::figura[Casos con contexto (tiempos entre llamadas, mediana, cola derecha): cada botón cambia el punto de lectura y una frase explica qué comparar.]{componente="FamilyLab"}
```yaml
modo: empirica
poblacion: exponencial
valores:
  x: 0.69
casos:
  - nombre: 'Tiempos entre llamadas'
    descripcion: 'x = 1: F(1) = 0.632.'
    valores: {x: 1}
  - nombre: 'Leer la mediana'
    descripcion: 'x = 0.69: F = 0.5.'
    valores: {x: 0.69}
  - nombre: 'Cola derecha'
    descripcion: 'x = 3: F = 0.95.'
    valores: {x: 3}
```
:::

:::figura[Población normal: la escalera se acerca a la curva en forma de S de la normal estándar; con 500 datos D_n queda cerca de 1/√500 ≈ 0.045.]{componente="FamilyLab"}
```yaml
modo: empirica
poblacion: normal
valores:
  x: 0
```
:::

## Errores comunes

- **Pensar que $F_n$ toma valores intermedios entre datos.** Es constante entre observaciones consecutivas y salta en ellas; no interpola.
- **Olvidar los empates.** Un valor repetido $k$ veces produce un salto de $k/n$.
- **Esperar que coincida con $F$ en una muestra chica.** Con 10 datos, diferencias de 0.2 a 0.3 son normales.
- **Confundirla con un histograma.** El histograma depende del ancho de las clases; la función empírica no tiene parámetros que elegir.

:::figura[Muestra chica, diferencia grande: con la población uniforme y 10 datos, la escalera puede separarse 0.2 o más de la recta verdadera sin que haya nada raro.]{componente="FamilyLab"}
```yaml
modo: empirica
poblacion: uniforme
valores:
  x: 0.5
```
:::

## Conexiones

Es una [[distribucion-uniforme-discreta]] sobre los datos observados, escrita con la [[funcion-indicadora-y-funcion-escalon]]. Su convergencia uniforme a la verdadera es el [[teorema-de-glivenko-cantelli]], y la fluctuación $\sqrt{n}(F_n - F)$ es el objeto del [[teorema-de-donsker]]. En las colas, con [[distribuciones-de-colas-pesadas]] hacen falta muchos datos para que la escalera represente bien los valores extremos. Es la base del bootstrap y de la prueba de Kolmogorov-Smirnov. El [[mapa-de-relaciones-entre-distribuciones]] reúne las distribuciones del módulo.

## Formulario

:::formula[Función de distribución empírica]
$$
F_n(x) = \frac{1}{n}\sum_{i=1}^{n} \mathbf{1}\{X_i \le x\}
$$

- $X_i$: observaciones; $n$: tamaño de muestra; $\mathbf{1}\{\cdot\}$: indicadora.
:::

:::formula[Media y varianza en un punto]
$$
\mathbb{E}[F_n(x)] = F(x), \qquad \operatorname{Var}(F_n(x)) = \frac{F(x)(1 - F(x))}{n}
$$

- $F$: función de distribución verdadera.
:::

:::formula[Distancia de Kolmogorov]
$$
D_n = \sup_{x} |F_n(x) - F(x)|
$$

- $\sup_x$: máximo sobre todos los puntos.
:::

:::formula[Desigualdad DKW]
$$
P(D_n > \varepsilon) \le 2e^{-2n\varepsilon^{2}}
$$

- $\varepsilon$: tolerancia positiva.
:::
