---
id: distancias
titulo: Distancias (euclidiana, Manhattan, Chebyshev, Minkowski)
titulo_en: Distances (Euclidean, Manhattan, Chebyshev, Minkowski)
alias:
  - distancia euclidiana
  - distancia Manhattan
  - distancia de taxi
  - distancia Chebyshev
  - distancia Minkowski
  - métrica
modulo: 0
submodulo: '0.3'
orden: 9
nivel: basico
prerrequisitos:
  - normas-vectoriales
etiquetas:
  - distancia
  - métrica
  - vecinos más cercanos
  - agrupamiento
resumen: >
  La distancia entre dos puntos es la norma de su diferencia; según la norma se obtiene la distancia en
  línea recta, la de recorrer una cuadrícula, la del mayor cambio de coordenada o la familia de Minkowski.
formula: 'd_p(\mathbf{a}, \mathbf{b}) = \lVert \mathbf{a} - \mathbf{b} \rVert_p = \Big( \sum_{i=1}^{n} |a_i - b_i|^p \Big)^{1/p}'
visualizacion:
  componente: VectorPlane
  parametros:
    modo: distancias
    a: [-3, 1]
    b: [2, -2]
    p: 4
referencias:
  - clave: strang
  - clave: hastie-esl
publicado: true
---

## Intuición

La distancia entre dos esquinas de una ciudad depende de cómo se viaje. Un helicóptero va en línea recta; un taxi tiene que seguir las calles y recorre la suma del tramo horizontal y el vertical; y un rey de ajedrez, que se mueve una casilla en cualquier dirección incluida la diagonal, necesita tantos movimientos como el mayor de los dos tramos. Son la distancia euclidiana, la Manhattan y la Chebyshev.

Las tres salen de la misma receta: restar los dos puntos para obtener el vector que los separa y medir ese vector con una norma. Cambiar de norma cambia qué puntos se consideran cercanos. Alrededor de un punto, los que están a la misma distancia forman un círculo con la euclidiana, un rombo con Manhattan y un cuadrado con Chebyshev. En métodos como los $k$ vecinos más cercanos o el agrupamiento, esa elección decide qué observaciones se parecen.

## Definición

:::definicion[Distancia inducida por una norma]
Para $\mathbf{a}, \mathbf{b} \in \mathbb{R}^n$, la distancia de **Minkowski** de orden $p \ge 1$ es
$$
d_p(\mathbf{a}, \mathbf{b}) = \lVert \mathbf{a} - \mathbf{b} \rVert_p = \Big( \sum_{i=1}^{n} |a_i - b_i|^p \Big)^{1/p}.
$$
Casos particulares: $p = 1$ es la distancia **Manhattan**, $p = 2$ la **euclidiana** y $p \to \infty$ la de **Chebyshev**, $d_\infty(\mathbf{a}, \mathbf{b}) = \max_i |a_i - b_i|$.
:::

Toda distancia de este tipo es una **métrica**: es no negativa, vale cero solo entre un punto y sí mismo, es simétrica y cumple la desigualdad del triángulo.

:::nota[Qué significa cada símbolo]
- $\mathbf{a}, \mathbf{b}$: los dos puntos, vectores de $\mathbb{R}^n$.
- $a_i, b_i$: sus coordenadas $i$.
- $|a_i - b_i|$: cambio absoluto en la coordenada $i$.
- $p$: exponente de Minkowski, mayor o igual que 1.
- $d_p$: distancia de orden $p$.
- $\lVert \cdot \rVert_p$: norma $L^p$.
- $n$: número de coordenadas.
:::

## Cómo usar la visualización

Los puntos $A$ y $B$ se arrastran. Aparecen el camino en escalera de Manhattan, el segmento recto euclidiano y, alrededor de $A$, las curvas de puntos que están a la misma distancia que $B$ según cada métrica. La reproducción resalta una distancia a la vez, y el control fija el exponente de Minkowski.

Con $A$ y $B$ sobre una misma línea horizontal, las cuatro distancias coinciden. Sobre una diagonal a 45 grados, Manhattan es $\sqrt{2}$ veces la euclidiana. Al subir el exponente de Minkowski, su curva pasa del rombo al círculo y luego al cuadrado de Chebyshev.

## Ejemplo

Un repartidor está en la esquina $A = (1, 1)$ y debe llegar a $B = (4, 5)$, con cuadras de 100 metros.

1. Diferencias: $|4 - 1| = 3$ cuadras al este y $|5 - 1| = 4$ al norte.
2. Manhattan: $3 + 4 = 7$ cuadras, 700 metros por las calles.
3. Euclidiana: $\sqrt{3^2 + 4^2} = 5$ cuadras, 500 metros en línea recta.
4. Chebyshev: $\max(3, 4) = 4$, los movimientos de un rey de ajedrez.
5. Minkowski con $p = 3$: $(27 + 64)^{1/3} = 91^{1/3} \approx 4.498$, entre la euclidiana y la de Chebyshev.

:::figura[Las esquinas del ejemplo. El camino en escalera mide 7 cuadras, el segmento recto 5 y el rey de ajedrez necesita 4 movimientos; cada curva alrededor de A marca los puntos a la misma distancia que B.]{componente="VectorPlane"}
```yaml
modo: distancias
a: [1, 1]
b: [4, 5]
p: 3
```
:::

## Propiedades

- **Axiomas de métrica:** $d(\mathbf{a}, \mathbf{b}) \ge 0$; $d(\mathbf{a}, \mathbf{b}) = 0 \iff \mathbf{a} = \mathbf{b}$; $d(\mathbf{a}, \mathbf{b}) = d(\mathbf{b}, \mathbf{a})$; $d(\mathbf{a}, \mathbf{c}) \le d(\mathbf{a}, \mathbf{b}) + d(\mathbf{b}, \mathbf{c})$.
- **Orden:** $d_\infty \le d_2 \le d_1$ para cualquier par de puntos.
- **Invariancia por traslación:** $d(\mathbf{a} + \mathbf{t}, \mathbf{b} + \mathbf{t}) = d(\mathbf{a}, \mathbf{b})$.
- **Rotaciones:** solo la distancia euclidiana no cambia al girar los ejes; Manhattan y Chebyshev dependen de la orientación de la cuadrícula.
- **Escala:** todas cambian si una variable se mide en otras unidades, por eso en datos se suelen estandarizar las variables antes de medir distancias.

:::figura[Caso de puntos alineados con un eje: si A y B solo difieren en una coordenada, las cuatro distancias son iguales y las curvas se tocan en B.]{componente="VectorPlane"}
```yaml
modo: distancias
a: [-3, -1]
b: [3, -1]
p: 2.5
```
:::

:::demostracion
Desigualdad del triángulo: $\mathbf{a} - \mathbf{c} = (\mathbf{a} - \mathbf{b}) + (\mathbf{b} - \mathbf{c})$, y por la desigualdad del triángulo de la norma, $\lVert \mathbf{a} - \mathbf{c} \rVert \le \lVert \mathbf{a} - \mathbf{b} \rVert + \lVert \mathbf{b} - \mathbf{c} \rVert$.
:::

## Errores comunes

- **Mezclar escalas.** Con edad en años e ingreso en pesos, la distancia euclidiana la decide casi por completo el ingreso.
- **Suponer que la distancia euclidiana siempre es la adecuada.** En una cuadrícula de calles o en datos con valores atípicos, Manhattan suele describir mejor la cercanía.
- **Usar $p < 1$.** La fórmula de Minkowski con $p < 1$ no cumple la desigualdad del triángulo.
- **Confundir distancia con disimilitud angular.** Dos documentos pueden estar lejos en distancia euclidiana y tener la misma dirección; para eso se usa la similitud coseno.

## Conexiones

Cada distancia es la norma de una diferencia, así que depende de las [[normas-vectoriales]]. La [[similitud-coseno]] mide cercanía por ángulo en lugar de por distancia, y la [[proyeccion-ortogonal]] busca el punto de un subespacio a menor distancia euclidiana. En aprendizaje automático, las distancias definen los vecinos más cercanos y los algoritmos de agrupamiento como k-medias.

## Formulario

:::formula[Minkowski]
$$
d_p(\mathbf{a}, \mathbf{b}) = \Big( \sum_{i=1}^{n} |a_i - b_i|^p \Big)^{1/p}
$$

- $a_i, b_i$: coordenadas de los puntos.
- $p$: exponente, $p \ge 1$.
- $n$: número de coordenadas.
:::

:::formula[Casos particulares]
$$
d_1 = \sum_i |a_i - b_i|, \qquad d_2 = \sqrt{\sum_i (a_i - b_i)^2}, \qquad d_\infty = \max_i |a_i - b_i|
$$

- $d_1$: Manhattan.
- $d_2$: euclidiana.
- $d_\infty$: Chebyshev.
:::

:::formula[Desigualdad del triángulo]
$$
d(\mathbf{a}, \mathbf{c}) \le d(\mathbf{a}, \mathbf{b}) + d(\mathbf{b}, \mathbf{c})
$$

- $\mathbf{a}, \mathbf{b}, \mathbf{c}$: tres puntos cualesquiera.
:::
