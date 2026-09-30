---
id: normas-vectoriales
titulo: Normas vectoriales (L1, L2, Linf, Lp)
titulo_en: Vector norms (L1, L2, L-infinity, Lp)
alias:
  - norma euclidiana
  - norma L1
  - norma infinito
  - norma p
  - norma del máximo
modulo: 0
submodulo: '0.3'
orden: 8
nivel: basico
prerrequisitos:
  - producto-punto
etiquetas:
  - norma
  - longitud
  - bola unitaria
  - regularización
resumen: >
  Una norma asigna a cada vector un tamaño no negativo que escala con el vector y cumple la desigualdad
  del triángulo; las normas Lp miden ese tamaño de distintas formas según el exponente p.
formula: '\lVert \mathbf{x} \rVert_p = \Big( \sum_{i=1}^{n} |x_i|^p \Big)^{1/p}, \qquad \lVert \mathbf{x} \rVert_\infty = \max_i |x_i|'
visualizacion:
  componente: VectorPlane
  parametros:
    modo: normas
    punto: [3, -2]
    p: 3
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
  - clave: boyd
publicado: true
---

## Intuición

Hay varias maneras razonables de decir qué tan grande es un vector. La más conocida es la longitud en línea recta, la de la regla. Pero un repartidor en una ciudad de calles en cuadrícula recorre la suma de las distancias horizontal y vertical, y una grúa que mueve sus dos ejes a la vez tarda lo que tarde el eje que más se mueve. Son tres medidas distintas del mismo desplazamiento.

Las normas $L^p$ reúnen todas esas medidas en una familia. Con $p = 1$ se suman los valores absolutos; con $p = 2$ se obtiene la longitud euclidiana; conforme $p$ crece, la componente más grande domina hasta que, en el límite, solo cuenta ella. Una forma de ver cada norma es dibujar su bola unitaria, los puntos de tamaño 1: un rombo para $p = 1$, un círculo para $p = 2$ y un cuadrado para $p = \infty$. Esa forma decide qué soluciones prefiere un método de ajuste cuando se penaliza el tamaño de los coeficientes.

## Definición

:::definicion[Norma]
Una **norma** en $\mathbb{R}^n$ es una función $\lVert \cdot \rVert : \mathbb{R}^n \to [0, \infty)$ que cumple, para todos $\mathbf{x}, \mathbf{y}$ y todo escalar $c$:
1. $\lVert \mathbf{x} \rVert = 0$ si y solo si $\mathbf{x} = \mathbf{0}$;
2. $\lVert c\,\mathbf{x} \rVert = |c|\,\lVert \mathbf{x} \rVert$;
3. $\lVert \mathbf{x} + \mathbf{y} \rVert \le \lVert \mathbf{x} \rVert + \lVert \mathbf{y} \rVert$.
:::

:::definicion[Normas Lp]
Para $1 \le p < \infty$,
$$
\lVert \mathbf{x} \rVert_p = \big( |x_1|^p + \dots + |x_n|^p \big)^{1/p}, \qquad \lVert \mathbf{x} \rVert_\infty = \max_{1 \le i \le n} |x_i|.
$$
Los casos más usados son $\lVert \mathbf{x} \rVert_1 = \sum |x_i|$, $\lVert \mathbf{x} \rVert_2 = \sqrt{\sum x_i^2}$ y $\lVert \mathbf{x} \rVert_\infty$.
:::

Con $0 < p < 1$ la fórmula no define una norma porque falla la desigualdad del triángulo.

:::nota[Qué significa cada símbolo]
- $\mathbf{x} = (x_1, \dots, x_n)$: vector que se mide.
- $|x_i|$: valor absoluto de la componente $i$.
- $p$: exponente de la norma, un número mayor o igual que 1.
- $\lVert \mathbf{x} \rVert_p$: norma $L^p$ de $\mathbf{x}$.
- $\lVert \mathbf{x} \rVert_\infty$: norma del máximo, la mayor componente en valor absoluto.
- $c$: escalar real.
- $n$: número de componentes.
:::

## Cómo usar la visualización

La punta de $\mathbf{x}$ se arrastra. Cada curva reúne los vectores que tienen el mismo tamaño que $\mathbf{x}$ según una norma: el rombo para $L^1$, el círculo para $L^2$ y el cuadrado para $L^\infty$, de modo que $\mathbf{x}$ está sobre las tres. La figura sombreada es la bola unitaria de la norma $L^p$ elegida; la reproducción la deforma variando $p$.

Sobre un eje, por ejemplo en $(3, 0)$, las tres normas valen 3 y las curvas se tocan en ese punto. En la diagonal $(2, 2)$ se separan más: $L^1 = 4$, $L^2 \approx 2.83$ y $L^\infty = 2$. Mientras $p$ crece, la bola pasa de rombo a círculo y se acerca al cuadrado.

## Ejemplo

Un modelo de pronóstico del clima comete errores $\mathbf{e} = (3, -4)$ grados en dos ciudades. Cada norma resume el error de forma distinta.

1. $\lVert \mathbf{e} \rVert_1 = |3| + |-4| = 7$: error absoluto total, base del error absoluto medio.
2. $\lVert \mathbf{e} \rVert_2 = \sqrt{9 + 16} = 5$: base del error cuadrático medio; pesa más los errores grandes.
3. $\lVert \mathbf{e} \rVert_\infty = \max(3, 4) = 4$: el peor error.
4. $\lVert \mathbf{e} \rVert_3 = (27 + 64)^{1/3} = 91^{1/3} \approx 4.498$, entre la norma 2 y la del máximo.
5. Se cumple $\lVert \mathbf{e} \rVert_\infty \le \lVert \mathbf{e} \rVert_2 \le \lVert \mathbf{e} \rVert_1$, es decir, $4 \le 5 \le 7$.

:::figura[El vector de errores del ejemplo sobre las curvas de norma constante. El rombo, el círculo y el cuadrado que pasan por (3, -4) tienen tamaños 7, 5 y 4.]{componente="VectorPlane"}
```yaml
modo: normas
punto: [3, -4]
p: 3
```
:::

## Propiedades

- **Orden entre normas:** $\lVert \mathbf{x} \rVert_\infty \le \lVert \mathbf{x} \rVert_2 \le \lVert \mathbf{x} \rVert_1$; en general, $\lVert \mathbf{x} \rVert_p$ decrece al aumentar $p$.
- **Equivalencia:** en $\mathbb{R}^n$, $\lVert \mathbf{x} \rVert_1 \le \sqrt{n}\,\lVert \mathbf{x} \rVert_2$ y $\lVert \mathbf{x} \rVert_2 \le \sqrt{n}\,\lVert \mathbf{x} \rVert_\infty$.
- **Límite:** $\lim_{p \to \infty} \lVert \mathbf{x} \rVert_p = \lVert \mathbf{x} \rVert_\infty$.
- **Norma 2 y producto punto:** $\lVert \mathbf{x} \rVert_2^2 = \mathbf{x} \cdot \mathbf{x}$; es la única norma $L^p$ que proviene de un producto interno.
- **Forma de la bola:** la bola $L^1$ tiene esquinas sobre los ejes; por eso penalizar con $L^1$ tiende a producir soluciones con componentes exactamente cero.

:::figura[Caso de un vector sobre la diagonal y bola con p = 1.5: en (2, 2) las normas se separan al máximo, 4, 2.83 y 2, y la bola intermedia queda entre el rombo y el círculo.]{componente="VectorPlane"}
```yaml
modo: normas
punto: [2, 2]
p: 1.5
```
:::

:::demostracion
Límite al infinito: sea $M = \max_i |x_i|$. Entonces $M^p \le \sum |x_i|^p \le n M^p$, y sacando raíz $p$, $M \le \lVert \mathbf{x} \rVert_p \le n^{1/p} M$. Como $n^{1/p} \to 1$ cuando $p \to \infty$, la norma tiende a $M$.
:::

## Errores comunes

- **Usar "norma" como sinónimo de norma euclidiana.** Hay que decir cuál; en regularización la diferencia entre $L^1$ y $L^2$ cambia el resultado.
- **Olvidar el valor absoluto en $L^1$.** $\lVert (3, -4) \rVert_1 = 7$, no $-1$.
- **Tomar $p < 1$ como norma.** La fórmula con $p = 0.5$ no cumple la desigualdad del triángulo.
- **Comparar errores medidos con normas distintas.** Un error $L^1$ de 7 y un error $L^2$ de 5 pueden venir del mismo vector.

## Conexiones

La norma euclidiana proviene del [[producto-punto]], y las normas miden las [[distancias]] entre puntos. Dividir entre la norma produce vectores unitarios, que aparecen en la [[similitud-coseno]] y en la [[ortogonalidad-y-ortonormalidad]]. Las [[normas-matriciales]] extienden la idea a matrices. En aprendizaje automático, la regularización ridge penaliza la norma $L^2$ de los coeficientes y lasso penaliza la norma $L^1$.

## Formulario

:::formula[Norma Lp]
$$
\lVert \mathbf{x} \rVert_p = \Big( \sum_{i=1}^{n} |x_i|^p \Big)^{1/p}, \quad p \ge 1
$$

- $x_i$: componentes del vector.
- $p$: exponente.
- $n$: número de componentes.
:::

:::formula[Casos usuales]
$$
\lVert \mathbf{x} \rVert_1 = \sum_i |x_i|, \qquad \lVert \mathbf{x} \rVert_2 = \sqrt{\sum_i x_i^2}, \qquad \lVert \mathbf{x} \rVert_\infty = \max_i |x_i|
$$

- $\lVert \cdot \rVert_1$: suma de valores absolutos.
- $\lVert \cdot \rVert_2$: longitud euclidiana.
- $\lVert \cdot \rVert_\infty$: mayor componente en valor absoluto.
:::

:::formula[Axiomas de norma]
$$
\lVert c\,\mathbf{x} \rVert = |c|\,\lVert \mathbf{x} \rVert, \qquad \lVert \mathbf{x} + \mathbf{y} \rVert \le \lVert \mathbf{x} \rVert + \lVert \mathbf{y} \rVert
$$

- $c$: escalar.
- $\mathbf{x}, \mathbf{y}$: vectores.
:::

:::formula[Comparación entre normas]
$$
\lVert \mathbf{x} \rVert_\infty \le \lVert \mathbf{x} \rVert_2 \le \lVert \mathbf{x} \rVert_1 \le \sqrt{n}\,\lVert \mathbf{x} \rVert_2
$$

- $n$: dimensión del espacio.
:::
