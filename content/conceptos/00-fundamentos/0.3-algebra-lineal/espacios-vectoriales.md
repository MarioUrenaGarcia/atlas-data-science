---
id: espacios-vectoriales
titulo: Espacios vectoriales
titulo_en: Vector spaces
alias:
  - espacio lineal
  - axiomas de espacio vectorial
modulo: 0
submodulo: '0.3'
orden: 2
nivel: basico
prerrequisitos:
  - vectores-y-operaciones-con-vectores
relaciones:
  - tipo: generaliza
    id: vectores-y-operaciones-con-vectores
etiquetas:
  - espacio vectorial
  - axiomas
  - cerradura
  - estructura algebraica
resumen: >
  Un espacio vectorial es un conjunto con una suma y un producto por escalares que no se salen del
  conjunto y cumplen las reglas de los vectores de R^n; incluye listas, funciones, polinomios y matrices.
formula: '\mathbf{u}, \mathbf{v} \in V,\ c \in \mathbb{R} \ \Rightarrow\ \mathbf{u} + \mathbf{v} \in V,\ c\,\mathbf{u} \in V'
visualizacion:
  componente: VectorPlane
  parametros:
    modo: cerradura
    conjuntos: [plano, recta-origen, origen]
    u: [1, 2]
    v: [0.5, 1]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

Muchos objetos se comportan como flechas aunque no lo parezcan. Dos señales de audio se pueden sumar instante por instante y una señal se puede amplificar multiplicándola por un número; dos polinomios se suman coeficiente a coeficiente; dos imágenes del mismo tamaño se promedian píxel a píxel. En todos los casos hay una forma de sumar y una forma de escalar, y el resultado es otro objeto del mismo tipo.

Un espacio vectorial reúne justo eso: un conjunto donde se puede sumar y multiplicar por números sin salir del conjunto, y donde esas operaciones cumplen las mismas reglas que con las flechas del plano. Lo valioso es que todo lo que se demuestra usando solo esas reglas vale a la vez para listas de números, funciones, polinomios y matrices. Por eso conceptos como base, dimensión o proyección sirven igual para ajustar una recta a datos que para aproximar una señal con senos y cosenos.

## Definición

:::definicion[Espacio vectorial real]
Un **espacio vectorial** sobre $\mathbb{R}$ es un conjunto $V$ con una suma $V \times V \to V$ y un producto por escalar $\mathbb{R} \times V \to V$ tales que, para todos $\mathbf{u}, \mathbf{v}, \mathbf{w} \in V$ y $a, b \in \mathbb{R}$:

1. $\mathbf{u} + \mathbf{v} = \mathbf{v} + \mathbf{u}$ y $(\mathbf{u} + \mathbf{v}) + \mathbf{w} = \mathbf{u} + (\mathbf{v} + \mathbf{w})$.
2. Existe $\mathbf{0} \in V$ con $\mathbf{u} + \mathbf{0} = \mathbf{u}$.
3. Para cada $\mathbf{u}$ existe $-\mathbf{u} \in V$ con $\mathbf{u} + (-\mathbf{u}) = \mathbf{0}$.
4. $a(\mathbf{u} + \mathbf{v}) = a\mathbf{u} + a\mathbf{v}$ y $(a + b)\mathbf{u} = a\mathbf{u} + b\mathbf{u}$.
5. $a(b\mathbf{u}) = (ab)\mathbf{u}$ y $1\mathbf{u} = \mathbf{u}$.
:::

Que las operaciones vayan de $V \times V$ a $V$ y de $\mathbb{R} \times V$ a $V$ es la **cerradura**: sumar o escalar nunca produce algo fuera de $V$. Los elementos de $V$ se llaman vectores aunque sean funciones o matrices.

:::nota[Qué significa cada símbolo]
- $V$: conjunto cuyos elementos se llaman vectores.
- $\mathbf{u}, \mathbf{v}, \mathbf{w}$: elementos cualesquiera de $V$.
- $a, b, c$: escalares, números reales.
- $\mathbb{R}$: conjunto de los números reales.
- $V \times V \to V$: la suma toma dos vectores y devuelve un vector de $V$.
- $\mathbf{0}$: vector cero de $V$, el neutro de la suma.
- $-\mathbf{u}$: inverso aditivo de $\mathbf{u}$.
:::

## Cómo usar la visualización

El selector elige un conjunto del plano, sombreado en gris. Los vectores $\mathbf{u}$ y $\mathbf{v}$ se arrastran, pero siempre se mantienen dentro del conjunto. En verde aparecen $\mathbf{u} + \mathbf{v}$ y $c\,\mathbf{u}$ cuando quedan dentro del conjunto; en rosa, cuando se salen. El control del escalar cambia $c$.

Con todo el plano, ningún resultado se sale. Con la recta $y = 2x$, sumar y escalar mueve las flechas a lo largo de la misma recta. Con el conjunto formado solo por el origen, los dos vectores quedan fijos en cero y todas las operaciones devuelven cero, el espacio vectorial más pequeño posible.

## Ejemplo

Se verifica que los polinomios de grado a lo más 2, $\mathcal{P}_2 = \{a_0 + a_1 t + a_2 t^2\}$, forman un espacio vectorial, y que se comportan como $\mathbb{R}^3$.

1. Suma: $(1 + 2t - t^2) + (3 - t + 4t^2) = 4 + t + 3t^2$, otro polinomio de grado a lo más 2. La suma no puede aumentar el grado.
2. Escalar: $-2(1 + 2t - t^2) = -2 - 4t + 2t^2$, también en $\mathcal{P}_2$.
3. El cero es el polinomio $0 + 0t + 0t^2$ y el inverso de $p$ es $-p$.
4. Las demás reglas se cumplen porque se verifican coeficiente a coeficiente. Asociando cada polinomio con la lista de sus coeficientes, $1 + 2t - t^2 \mapsto (1, 2, -1)$, las operaciones coinciden con las de $\mathbb{R}^3$.
5. En cambio, los polinomios de grado **exactamente** 2 no forman un espacio: $(t^2 + 1) + (-t^2) = 1$ tiene grado 0, y además el cero no está.

:::figura[Los dos polinomios del ejemplo vistos por sus dos primeros coeficientes (a₀, a₁). Sumarlos y escalarlos coincide con sumar y escalar las flechas (1, 2) y (3, -1) del plano.]{componente="VectorPlane"}
```yaml
modo: operaciones
u: [1, 2]
v: [3, -1]
escalar: -2
```
:::

## Propiedades

- **Unicidad:** el vector cero y el inverso de cada vector son únicos.
- **Consecuencias de los axiomas:** $0\,\mathbf{u} = \mathbf{0}$, $c\,\mathbf{0} = \mathbf{0}$ y $(-1)\mathbf{u} = -\mathbf{u}$.
- **Ejemplos estándar:** $\mathbb{R}^n$; las matrices de $m \times n$; los polinomios de grado a lo más $d$; las funciones continuas en un intervalo; las sucesiones reales.
- **Cancelación:** si $\mathbf{u} + \mathbf{w} = \mathbf{v} + \mathbf{w}$, entonces $\mathbf{u} = \mathbf{v}$.
- **Todo espacio contiene al cero:** un conjunto sin el vector cero no puede ser espacio vectorial con las operaciones usuales.

:::figura[Casos que no son espacios vectoriales dentro del plano: una recta que no pasa por el origen, el primer cuadrante y la unión de los dos ejes. En cada uno hay una suma o un múltiplo que se sale.]{componente="VectorPlane"}
```yaml
modo: cerradura
conjuntos: [recta-desplazada, primer-cuadrante, union-ejes]
u: [1, 3]
v: [0, 1]
```
:::

:::demostracion
Para ver que $0\,\mathbf{u} = \mathbf{0}$: por la distributiva, $0\,\mathbf{u} = (0 + 0)\mathbf{u} = 0\,\mathbf{u} + 0\,\mathbf{u}$. Sumando $-(0\,\mathbf{u})$ en ambos lados queda $\mathbf{0} = 0\,\mathbf{u}$.
:::

## Errores comunes

- **Olvidar revisar la cerradura.** Un conjunto puede cumplir las reglas algebraicas en cuanto a fórmulas y aun así no ser espacio porque una suma se sale; el primer cuadrante es el ejemplo típico con escalares negativos.
- **Creer que "vector" significa "flecha".** Las funciones y las matrices son vectores de sus propios espacios.
- **Suponer que cualquier recta es un espacio vectorial.** Solo las que pasan por el origen lo son.
- **Confundir el cero del espacio con el número cero.** En el espacio de matrices, el cero es la matriz con todas sus entradas nulas.

## Conexiones

Los axiomas generalizan las reglas de [[vectores-y-operaciones-con-vectores]] y se enuncian con el lenguaje de [[conjuntos-y-notacion]]. Dentro de un espacio vectorial se estudian la [[combinacion-lineal-y-espacio-generado|combinación lineal]], la [[independencia-lineal]], la [[base-y-dimension]] y los [[subespacios]]. En estadística, el conjunto de variables aleatorias con varianza finita es un espacio vectorial, lo que permite hablar de proyecciones al estudiar regresión.

## Formulario

:::formula[Cerradura]
$$
\mathbf{u}, \mathbf{v} \in V,\ c \in \mathbb{R} \ \Rightarrow\ \mathbf{u} + \mathbf{v} \in V,\quad c\,\mathbf{u} \in V
$$

- $V$: espacio vectorial.
- $\mathbf{u}, \mathbf{v}$: vectores de $V$.
- $c$: escalar real.
:::

:::formula[Neutro e inverso]
$$
\mathbf{u} + \mathbf{0} = \mathbf{u}, \qquad \mathbf{u} + (-\mathbf{u}) = \mathbf{0}
$$

- $\mathbf{0}$: vector cero de $V$.
- $-\mathbf{u}$: inverso aditivo de $\mathbf{u}$.
:::

:::formula[Distributivas]
$$
a(\mathbf{u} + \mathbf{v}) = a\mathbf{u} + a\mathbf{v}, \qquad (a + b)\mathbf{u} = a\mathbf{u} + b\mathbf{u}
$$

- $a, b$: escalares reales.
:::

:::formula[Consecuencias]
$$
0\,\mathbf{u} = \mathbf{0}, \qquad c\,\mathbf{0} = \mathbf{0}, \qquad (-1)\,\mathbf{u} = -\mathbf{u}
$$

- $0$: el número cero; $\mathbf{0}$: el vector cero.
:::
