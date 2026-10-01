---
id: subespacios
titulo: Subespacios
titulo_en: Subspaces
alias:
  - subespacio vectorial
  - prueba del subespacio
modulo: 0
submodulo: '0.3'
orden: 6
nivel: basico
prerrequisitos:
  - base-y-dimension
etiquetas:
  - subespacio
  - cerradura
  - rectas y planos por el origen
  - dimensión
resumen: >
  Un subespacio es un subconjunto de un espacio vectorial que contiene al cero y es cerrado bajo suma y
  producto por escalar; en R³ son el origen, las rectas y planos por el origen y todo el espacio.
formula: '\mathbf{0} \in W,\quad \mathbf{u}, \mathbf{v} \in W \Rightarrow \mathbf{u} + \mathbf{v} \in W,\quad c\,\mathbf{u} \in W'
visualizacion:
  componente: VectorPlane
  parametros:
    modo: cerradura
    conjuntos: [recta-origen, recta-desplazada, primer-cuadrante, union-ejes]
    u: [1, 2]
    v: [1.5, 0.5]
relaciones:
  - tipo: caso-particular
    id: espacios-vectoriales
referencias:
  - clave: strang
publicado: true
---

## Intuición

Dentro del plano hay conjuntos que se comportan como espacios vectoriales por sí mismos. Una recta que pasa por el origen es uno: sumar dos flechas de la recta da otra flecha de la recta, y estirarla no la saca de ahí. Es como un riel: un tren que solo avanza o retrocede sobre él nunca lo abandona.

Otros conjuntos parecen razonables pero fallan. La recta $y = 2x + 1$ no contiene al origen, y la suma de dos de sus puntos cae en una recta paralela. El primer cuadrante aguanta sumas, pero multiplicar por $-1$ lo manda al cuadrante opuesto. Los dos ejes juntos aguantan múltiplos, pero la suma de una flecha horizontal con una vertical cae entre ellos. Un subespacio es un conjunto que pasa las tres pruebas: contiene al cero, no se sale con sumas y no se sale con múltiplos. En la práctica, los subespacios aparecen como los conjuntos de soluciones de ecuaciones lineales homogéneas y como los conjuntos generados por unos vectores.

## Definición

:::definicion[Subespacio]
Un subconjunto $W$ de un espacio vectorial $V$ es un **subespacio** si
1. $\mathbf{0} \in W$;
2. $\mathbf{u}, \mathbf{v} \in W \Rightarrow \mathbf{u} + \mathbf{v} \in W$;
3. $\mathbf{u} \in W,\ c \in \mathbb{R} \Rightarrow c\,\mathbf{u} \in W$.
:::

Con estas tres condiciones, $W$ es un espacio vectorial con las mismas operaciones de $V$: las demás reglas se heredan. Las condiciones 2 y 3 se pueden resumir en una: $a\mathbf{u} + b\mathbf{v} \in W$ para todos $\mathbf{u}, \mathbf{v} \in W$ y $a, b \in \mathbb{R}$.

:::nota[Qué significa cada símbolo]
- $V$: espacio vectorial que contiene a $W$.
- $W$: subconjunto que se pone a prueba.
- $\mathbf{0}$: vector cero de $V$.
- $\mathbf{u}, \mathbf{v}$: vectores cualesquiera de $W$.
- $a, b, c$: escalares reales.
- $\in$: "pertenece a".
:::

## Cómo usar la visualización

El selector elige un conjunto candidato $W$, sombreado en gris. Los vectores $\mathbf{u}$ y $\mathbf{v}$ se arrastran y se mantienen dentro de $W$. La suma $\mathbf{u} + \mathbf{v}$ y el múltiplo $c\,\mathbf{u}$ aparecen en verde si quedan en $W$ y en rosa si se salen; el panel indica además si $\mathbf{0}$ está en $W$.

Con la recta que no pasa por el origen, la suma sale en rosa para cualquier elección. En el primer cuadrante la suma siempre queda dentro, pero con $c$ negativo el múltiplo sale. En la unión de los ejes, un vector sobre cada eje produce una suma fuera. Solo la recta $y = 2x$ pasa todas las pruebas.

## Ejemplo

Se verifica que el plano $W = \{(x, y, z) : x + y - z = 0\}$ es un subespacio de $\mathbb{R}^3$, por ejemplo el conjunto de balances donde ingresos más subsidios igualan gastos.

1. El cero cumple $0 + 0 - 0 = 0$, así que $\mathbf{0} \in W$.
2. Si $\mathbf{u}$ y $\mathbf{v}$ cumplen la ecuación, $(u_1 + v_1) + (u_2 + v_2) - (u_3 + v_3) = (u_1 + u_2 - u_3) + (v_1 + v_2 - v_3) = 0 + 0 = 0$.
3. Para $c\,\mathbf{u}$: $c u_1 + c u_2 - c u_3 = c(u_1 + u_2 - u_3) = 0$.
4. Despejando $z = x + y$, cada punto es $(x, y, x + y) = x(1, 0, 1) + y(0, 1, 1)$, así que $W = \operatorname{gen}\{(1, 0, 1), (0, 1, 1)\}$ y $\dim W = 2$.
5. En cambio, $\{x + y - z = 3\}$ no es subespacio: el cero no cumple la ecuación.

:::figura[El plano x + y - z = 0 del ejemplo, generado por (1, 0, 1) y (0, 1, 1). Su suma (1, 1, 2) también queda en el plano.]{componente="Space3D"}
```yaml
modo: generado
conjuntos:
  - nombre: Generadores del plano
    vectores: [[1, 0, 1], [0, 1, 1]]
  - nombre: Con su suma
    vectores: [[1, 0, 1], [0, 1, 1], [1, 1, 2]]
```
:::

## Propiedades

- **Subespacios de $\mathbb{R}^3$:** el origen (dimensión 0), las rectas por el origen (1), los planos por el origen (2) y $\mathbb{R}^3$ (3).
- **Espacio generado:** $\operatorname{gen}\{\mathbf{v}_1, \dots, \mathbf{v}_k\}$ es siempre un subespacio.
- **Soluciones homogéneas:** el conjunto de soluciones de $\mathbf{A}\mathbf{x} = \mathbf{0}$ es un subespacio; el de $\mathbf{A}\mathbf{x} = \mathbf{b}$ con $\mathbf{b} \neq \mathbf{0}$ no lo es.
- **Intersección:** la intersección de dos subespacios es un subespacio.
- **Unión:** la unión de dos subespacios casi nunca lo es; solo cuando uno contiene al otro.
- **Dimensión:** si $W \subseteq V$, entonces $\dim W \le \dim V$, con igualdad solo si $W = V$ (en dimensión finita).

:::figura[Los subespacios propios de R³ según su dimensión: una recta por el origen y un plano por el origen.]{componente="Space3D"}
```yaml
modo: generado
conjuntos:
  - nombre: Recta por el origen
    vectores: [[1, 2, 2]]
  - nombre: Plano por el origen
    vectores: [[2, 0, 1], [0, 2, -1]]
```
:::

:::demostracion
Intersección: si $W_1$ y $W_2$ son subespacios, el cero está en ambos. Si $\mathbf{u}, \mathbf{v}$ están en ambos, $a\mathbf{u} + b\mathbf{v}$ está en $W_1$ por ser subespacio y en $W_2$ por lo mismo, así que está en la intersección.
:::

## Errores comunes

- **Olvidar revisar el cero.** Es la prueba más rápida: si $\mathbf{0} \notin W$, no hay nada más que revisar.
- **Probar la cerradura con un solo ejemplo.** Un par de vectores cuya suma queda dentro no demuestra nada; la condición es para todos los pares.
- **Suponer que la unión de subespacios es subespacio.** La unión de los dos ejes es el contraejemplo clásico.
- **Pensar que cualquier plano es subespacio.** Solo los que pasan por el origen.

## Conexiones

Un subespacio es un [[espacios-vectoriales|espacio vectorial]] dentro de otro, y su tamaño se mide con la [[base-y-dimension|dimensión]]. Cada matriz tiene cuatro subespacios asociados, estudiados en [[espacio-columna-espacio-fila-y-espacio-nulo]], y la [[proyeccion-ortogonal]] busca el punto de un subespacio más cercano a un vector dado. En estadística, el ajuste por mínimos cuadrados proyecta los datos sobre el subespacio generado por las variables explicativas.

## Formulario

:::formula[Prueba del subespacio]
$$
\mathbf{0} \in W, \qquad \mathbf{u}, \mathbf{v} \in W,\ a, b \in \mathbb{R} \ \Rightarrow\ a\mathbf{u} + b\mathbf{v} \in W
$$

- $W$: subconjunto candidato.
- $\mathbf{u}, \mathbf{v}$: vectores de $W$.
- $a, b$: escalares reales.
:::

:::formula[Espacio de soluciones homogéneas]
$$
W = \{\mathbf{x} : \mathbf{A}\mathbf{x} = \mathbf{0}\}
$$

- $\mathbf{A}$: matriz de coeficientes.
- $\mathbf{x}$: vector de incógnitas.
:::

:::formula[Dimensión de un subespacio]
$$
W \subseteq V \ \Rightarrow\ \dim W \le \dim V
$$

- $\dim$: número de vectores de cualquier base.
:::
