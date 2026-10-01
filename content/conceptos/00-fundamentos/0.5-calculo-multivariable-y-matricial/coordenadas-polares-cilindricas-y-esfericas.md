---
id: coordenadas-polares-cilindricas-y-esfericas
titulo: Coordenadas polares, cilíndricas y esféricas
titulo_en: Polar, cylindrical and spherical coordinates
alias:
  - coordenadas polares
  - coordenadas cilíndricas
  - coordenadas esféricas
modulo: 0
submodulo: '0.5'
orden: 13
nivel: intermedio
prerrequisitos:
  - cambio-de-variables-y-determinante-jacobiano
etiquetas:
  - coordenadas polares
  - coordenadas esféricas
  - elemento de volumen
  - cambio de variables
resumen: >
  Las coordenadas polares, cilíndricas y esféricas describen puntos con distancias y ángulos; sus
  elementos de área y volumen llevan los factores r y ρ² sen φ.
formula: 'x = r\cos\theta,\ y = r\operatorname{sen}\theta,\ dA = r\,dr\,d\theta; \qquad dV = \rho^2\operatorname{sen}\varphi\,d\rho\,d\theta\,d\varphi'
visualizacion:
  componente: SurfaceViz
  parametros:
    modo: coordenadas
    sistemas: [polares, cilindricas, esfericas]
referencias:
  - clave: strang
  - clave: blitzstein-hwang
    capitulo: '8.1'
publicado: true
---

## Intuición

Para indicar dónde está un barco, un faro no da coordenadas $x$ y $y$: da una distancia y un rumbo. Para ubicar un avión, un radar da la distancia, el rumbo y el ángulo de elevación. Son formas de describir un punto pensadas para problemas con un centro o con simetría alrededor de un eje, donde las coordenadas cartesianas complican las cosas.

Las coordenadas polares describen un punto del plano con su distancia $r$ al origen y su ángulo $\theta$. Las cilíndricas añaden la altura $z$, como en una lata. Las esféricas usan la distancia $\rho$ al origen y dos ángulos, como la latitud y la longitud de un punto en la Tierra. En ellas, círculos, cilindros y esferas se escriben con una sola ecuación simple, y las integrales sobre esas regiones se vuelven integrales sobre rectángulos. El precio es un factor en el elemento de área o volumen: lejos del centro, un mismo cambio de ángulo barre más espacio.

## Definición

:::definicion[Polares]
$x = r\cos\theta$, $y = r\operatorname{sen}\theta$, con $r \ge 0$ y $\theta \in [0, 2\pi)$. Recíprocamente, $r = \sqrt{x^2 + y^2}$ y $\theta$ es el ángulo del punto, con $\tan\theta = y/x$ ajustado al cuadrante. Elemento de área: $dA = r\,dr\,d\theta$.
:::

:::definicion[Cilíndricas]
$x = r\cos\theta$, $y = r\operatorname{sen}\theta$, $z = z$. Elemento de volumen: $dV = r\,dr\,d\theta\,dz$.
:::

:::definicion[Esféricas]
$x = \rho\operatorname{sen}\varphi\cos\theta$, $y = \rho\operatorname{sen}\varphi\operatorname{sen}\theta$, $z = \rho\cos\varphi$, con $\rho \ge 0$, $\theta \in [0, 2\pi)$ y $\varphi \in [0, \pi]$. Elemento de volumen: $dV = \rho^2\operatorname{sen}\varphi\,d\rho\,d\theta\,d\varphi$.
:::

Los factores $r$ y $\rho^2\operatorname{sen}\varphi$ son los determinantes jacobianos de cada cambio de variables.

:::nota[Qué significa cada símbolo]
- $x, y, z$: coordenadas cartesianas.
- $r$: distancia al origen en el plano, o al eje $z$ en el espacio.
- $\theta$: ángulo medido desde el eje $x$ positivo, en sentido antihorario.
- $z$: altura sobre el plano $xy$.
- $\rho$: distancia al origen en el espacio.
- $\varphi$: ángulo medido desde el eje $z$ positivo, entre 0 y $\pi$.
- $dA$, $dV$: elementos de área y de volumen.
:::

## Cómo usar la visualización

El selector elige el sistema. En polares se ve el plano con círculos y rayos; en cilíndricas y esféricas, una escena 3D que se puede girar. Un punto amarillo da vueltas al aumentar $\theta$ y lleva pegado un elemento naranja, el pedazo de área o de volumen que barren pequeños incrementos de cada coordenada. El encabezado convierte el punto a cartesianas y calcula el tamaño del elemento con su factor. Los controles cambian la distancia, la altura y el ángulo $\varphi$.

Al aumentar la distancia, el elemento crece aunque los incrementos de las coordenadas no cambien. En esféricas, al llevar $\varphi$ hacia el polo, el factor $\operatorname{sen}\varphi$ hace que el elemento se adelgace.

## Ejemplo

Una estación de radar ubica un dron a $\rho = 1.6$ km, con rumbo $\theta = 30°$ desde el este y a $\varphi = 60°$ del cenit. Se busca su posición en cartesianas y en cilíndricas.

1. $\operatorname{sen}60° = 0.8660$, $\cos 60° = 0.5$, $\cos 30° = 0.8660$, $\operatorname{sen}30° = 0.5$.
2. $x = 1.6 \cdot 0.8660 \cdot 0.8660 = 1.2$ km.
3. $y = 1.6 \cdot 0.8660 \cdot 0.5 = 0.6928$ km.
4. $z = 1.6 \cdot 0.5 = 0.8$ km de altura.
5. Cilíndricas: $r = \rho\operatorname{sen}\varphi = 1.3856$ km, $\theta = 30°$ y $z = 0.8$ km. Comprobación: $\sqrt{1.2^2 + 0.6928^2} = 1.3856$.
6. Factor de volumen ahí: $\rho^2\operatorname{sen}\varphi = 2.56 \cdot 0.8660 = 2.217$; una caja de coordenadas de $0.01 \times 0.01 \times 0.01$ ocupa unos $2.2 \times 10^{-6}$ km³.

:::figura[El dron del ejemplo en esféricas, con ρ = 1.6 y φ = 60 grados: al empezar, en θ = 30 grados, el punto está en (1.2, 0.69, 0.8), y el elemento de volumen lleva el factor ρ² sen φ = 2.217.]{componente="SurfaceViz"}
```yaml
modo: coordenadas
sistemas: [esfericas]
radio: 1.6
polar: 60
angulo: 30
```
:::

## Propiedades

- **Regiones simples:** el disco $x^2 + y^2 \le R^2$ es $\{0 \le r \le R\}$; el cilindro es $\{r \le R,\ 0 \le z \le h\}$; la bola es $\{\rho \le R\}$.
- **Áreas y volúmenes:** área del disco $\int_0^{2\pi}\int_0^R r\,dr\,d\theta = \pi R^2$; volumen de la bola $\int_0^{\pi}\int_0^{2\pi}\int_0^R \rho^2\operatorname{sen}\varphi\,d\rho\,d\theta\,d\varphi = \tfrac{4}{3}\pi R^3$.
- **Simetría radial:** si $f$ solo depende de $r$, $\iint f\,dA = 2\pi\int_0^\infty f(r)\,r\,dr$.
- **Relaciones:** $r = \rho\operatorname{sen}\varphi$ y $z = \rho\cos\varphi$ conectan cilíndricas con esféricas.

:::figura[En cilíndricas, con r = 1 y z = 1.2, el elemento de volumen r dr dθ dz es un trozo de cascarón cilíndrico; al alejarse del eje, el mismo dθ cubre un arco más largo y el elemento crece en proporción a r.]{componente="SurfaceViz"}
```yaml
modo: coordenadas
sistemas: [cilindricas]
radio: 1
altura: 1.2
angulo: 0
```
:::

## Errores comunes

- **Calcular $\theta$ con $\arctan(y/x)$ sin mirar el cuadrante.** Para $(-1, -1)$, $\arctan(1) = 45°$, pero el ángulo correcto es $225°$.
- **Intercambiar $\theta$ y $\varphi$.** En física suele ser al revés: $\theta$ desde el cenit y $\varphi$ el rumbo. Hay que fijar la convención antes de usar las fórmulas.
- **Olvidar el factor.** $dx\,dy$ no es $dr\,d\theta$ y $dx\,dy\,dz$ no es $d\rho\,d\theta\,d\varphi$.
- **Permitir $r$ negativo** o $\varphi$ fuera de $[0, \pi]$, lo que describe dos veces los mismos puntos.

:::figura[El punto (-1, -1) en polares: está a r = 1.41 y en el ángulo 225 grados, en el tercer cuadrante, no en 45 grados, que es lo que daría arctan(y/x) sin corregir.]{componente="SurfaceViz"}
```yaml
modo: coordenadas
sistemas: [polares]
radio: 1.4
angulo: 225
```
:::

## Conexiones

Son los casos más usados del [[cambio-de-variables-y-determinante-jacobiano]], con su factor jacobiano. Simplifican las [[integrales-dobles-y-triples]] sobre discos, cilindros y bolas, y con las polares se calcula la [[integral-gaussiana]]. Reaparecen en la normal bivariada, en simulación (el método de Box y Muller usa polares) y en datos direccionales, como el viento o la orientación de un objeto.

## Formulario

:::formula[Polares]
$$
x = r\cos\theta, \qquad y = r\operatorname{sen}\theta, \qquad dA = r\,dr\,d\theta
$$

- $r \ge 0$: distancia al origen; $\theta$: ángulo desde el eje $x$.
:::

:::formula[Cilíndricas]
$$
x = r\cos\theta, \qquad y = r\operatorname{sen}\theta, \qquad z = z, \qquad dV = r\,dr\,d\theta\,dz
$$

- $r$: distancia al eje $z$; $z$: altura.
:::

:::formula[Esféricas]
$$
x = \rho\operatorname{sen}\varphi\cos\theta, \quad y = \rho\operatorname{sen}\varphi\operatorname{sen}\theta, \quad z = \rho\cos\varphi, \quad dV = \rho^2\operatorname{sen}\varphi\,d\rho\,d\theta\,d\varphi
$$

- $\rho$: distancia al origen.
- $\theta$: rumbo desde el eje $x$; $\varphi$: ángulo desde el eje $z$, entre 0 y $\pi$.
:::

:::formula[Volumen de una bola]
$$
\int_0^{\pi} \!\! \int_0^{2\pi} \!\! \int_0^R \rho^2\operatorname{sen}\varphi\,d\rho\,d\theta\,d\varphi = \frac{4}{3}\pi R^3
$$

- $R$: radio de la bola.
:::
