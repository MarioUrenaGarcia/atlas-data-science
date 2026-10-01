---
id: busqueda-lineal
titulo: Búsqueda lineal (condiciones de Armijo y Wolfe)
titulo_en: Line search (Armijo and Wolfe conditions)
alias:
  - búsqueda lineal
  - condición de Armijo
  - condiciones de Wolfe
  - retroceso
  - backtracking
modulo: 0
submodulo: '0.6'
orden: 7
nivel: intermedio
prerrequisitos:
  - descenso-de-gradiente
etiquetas:
  - búsqueda lineal
  - Armijo
  - Wolfe
  - tamaño de paso
resumen: >
  La búsqueda lineal elige el tamaño de cada paso a lo largo de una dirección de descenso; la condición de
  Armijo exige una bajada suficiente y la de Wolfe evita pasos demasiado cortos.
formula: 'f(\mathbf{x} + \alpha\mathbf{d}) \le f(\mathbf{x}) + c_1\alpha\,\nabla f(\mathbf{x})^\top \mathbf{d}, \qquad \nabla f(\mathbf{x} + \alpha\mathbf{d})^\top \mathbf{d} \ge c_2\,\nabla f(\mathbf{x})^\top \mathbf{d}'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: busqueda-lineal
    funciones: [rosenbrock, cuadratica]
    inicio: [-1.2, 1]
    alfa0: 0.005
referencias:
  - clave: boyd
    capitulo: '9.2'
publicado: true
---

## Intuición

Una vez elegida la dirección de bajada, queda decidir cuánto avanzar. Un paso fijo es arriesgado: en una zona suave sería tímido y en una zona muy curva podría pasarse del fondo. La búsqueda lineal resuelve la duda en cada paso mirando la función solo a lo largo de esa dirección: una curva de una variable, el perfil del terreno en línea recta.

La estrategia más común es el retroceso. Se propone un paso generoso y, si no baja lo suficiente, se reduce a la mitad, y otra vez, hasta que baje. "Lo suficiente" lo define la condición de Armijo: la bajada debe ser al menos una fracción de lo que prometía la pendiente inicial. Sin esa exigencia se aceptarían pasos que apenas mejoran. La condición de Wolfe añade otra regla: que al final del paso el terreno ya no baje tan empinado como al principio, para descartar pasos tan cortos que dejan sin aprovechar la bajada.

## Definición

Sea $\mathbf{d}$ una dirección de descenso en $\mathbf{x}$, es decir, $\nabla f(\mathbf{x})^\top \mathbf{d} < 0$, y sea $\varphi(\alpha) = f(\mathbf{x} + \alpha\mathbf{d})$ el perfil de la función en esa dirección.

:::definicion[Condiciones de Armijo y Wolfe]
Con constantes $0 < c_1 < c_2 < 1$, un paso $\alpha > 0$ cumple:
- **Armijo** (descenso suficiente): $\varphi(\alpha) \le \varphi(0) + c_1\alpha\,\varphi'(0)$.
- **Curvatura** (Wolfe): $\varphi'(\alpha) \ge c_2\,\varphi'(0)$.

Las **condiciones de Wolfe** son ambas a la vez.
:::

:::definicion[Retroceso]
Dados $\alpha_0 > 0$ y $\rho \in (0, 1)$, se prueba $\alpha = \alpha_0, \rho\alpha_0, \rho^2\alpha_0, \dots$ y se acepta el primero que cumple Armijo.
:::

Con $\varphi'(0) = \nabla f(\mathbf{x})^\top \mathbf{d}$, la recta $\varphi(0) + c_1\alpha\varphi'(0)$ es menos inclinada que la tangente, y para $\alpha$ pequeño la curva está por debajo de ella; por eso el retroceso siempre termina.

:::nota[Qué significa cada símbolo]
- $\mathbf{x}$: punto actual; $\mathbf{d}$: dirección de descenso, por ejemplo $-\nabla f(\mathbf{x})$.
- $\alpha$: tamaño del paso a lo largo de $\mathbf{d}$.
- $\varphi(\alpha)$: valor de $f$ tras avanzar $\alpha$; $\varphi'(0)$: pendiente inicial, negativa.
- $c_1$: fracción de la bajada prometida que se exige, típicamente $10^{-4}$.
- $c_2$: fracción de la pendiente inicial que se tolera al final, típicamente $0.9$.
- $\alpha_0$: paso inicial; $\rho$: factor de reducción.
:::

## Cómo usar la visualización

A la izquierda, el mapa de la función con la dirección de máximo descenso como línea punteada y los pasos probados como puntos. A la derecha, el perfil $\varphi(\alpha)$ en azul y la recta de Armijo en naranja: un paso es aceptable donde la curva queda por debajo de la recta. Cada cuadro de la reproducción prueba un paso más corto; los rechazados aparecen en gris y el aceptado en verde. El encabezado compara $\varphi(\alpha)$ con el límite de Armijo en números.

Al subir $c_1$ la recta se inclina más y solo se aceptan pasos más cortos. Al bajar $\rho$, el retroceso salta más rápido hacia pasos pequeños.

## Ejemplo

Para $f(x, y) = \tfrac{1}{2}(x^2 + 10y^2)$ en $\mathbf{x} = (3, 1.5)$, con $\mathbf{d} = -\nabla f = (-3, -15)$, se hace retroceso con $\alpha_0 = 0.3$, $\rho = 0.5$ y $c_1 = 0.3$.

1. $\varphi(0) = 15.75$ y $\varphi'(0) = \nabla f^\top \mathbf{d} = -(9 + 225) = -234$; la recta de Armijo es $15.75 - 70.2\alpha$.
2. $\alpha = 0.3$: el punto $(2.1, -3)$ da $\varphi = 47.205$, mayor que $15.75 - 21.06 = -5.31$. Se rechaza.
3. $\alpha = 0.15$: el punto $(2.55, -0.75)$ da $\varphi = 6.0638$, mayor que $15.75 - 10.53 = 5.22$. Se rechaza.
4. $\alpha = 0.075$: el punto $(2.775, 0.375)$ da $\varphi = 4.5534 \le 15.75 - 5.265 = 10.485$. Se acepta.
5. Wolfe con $c_2 = 0.9$: $\varphi'(0.075) = (2.775, 3.75) \cdot (-3, -15) = -64.58 \ge 0.9 \cdot (-234) = -210.6$. También se cumple.
6. El paso exacto, que minimiza $\varphi$, sería $\alpha^* = \dfrac{234}{9 + 2250} = 0.1036$; el retroceso se queda cerca sin calcularlo.

:::figura[El retroceso del ejemplo: los pasos 0.3 y 0.15 quedan por encima de la recta de Armijo y se rechazan; el paso 0.075 queda por debajo, φ = 4.55 frente a 10.49, y se acepta.]{componente="OptimizerRace"}
```yaml
modo: busqueda-lineal
funciones: [cuadratica]
inicio: [3, 1.5]
alfa0: 0.3
c1: 0.3
rho: 0.5
```
:::

## Propiedades

- **Terminación:** para cualquier $c_1 \in (0, 1)$ existe $\bar\alpha > 0$ tal que todo $\alpha \in (0, \bar\alpha]$ cumple Armijo, así que el retroceso termina en un número finito de pruebas.
- **Existencia de pasos de Wolfe:** si $f$ es acotada por abajo en la dirección, existen pasos que cumplen ambas condiciones.
- **Convergencia:** el descenso de gradiente con pasos de Armijo, o cualquier método con direcciones de descenso y pasos de Wolfe, hace que el gradiente tienda a cero.
- **Búsqueda exacta:** minimizar $\varphi$ por completo es más caro y casi nunca vale la pena; en cuadráticas tiene fórmula, $\alpha^* = -\dfrac{\nabla f^\top \mathbf{d}}{\mathbf{d}^\top \mathbf{A}\mathbf{d}}$.
- **Cuasi-Newton:** BFGS necesita pasos que cumplan la condición de curvatura para mantener definida positiva su aproximación.

:::figura[Gradiente con pasos de Armijo frente a gradiente con paso exacto sobre ½(x² + 10y²): con paso exacto, cada dirección es perpendicular a la anterior y el camino forma una escalera; con Armijo los pasos son más cortos pero baratos de calcular.]{componente="OptimizerRace"}
```yaml
modo: carrera
funciones: [cuadratica]
metodos: [gradiente-armijo, gradiente-exacto]
inicio: [3, 1.5]
```
:::

## Errores comunes

- **Exigir un descenso demasiado grande.** Con $c_1$ cerca de 1 solo se aceptan pasos muy cortos y el método avanza poco; los valores usuales son $c_1 = 10^{-4}$ y, para Wolfe, $c_2 = 0.9$.
- **Aceptar cualquier descenso.** Sin la condición de Armijo, una sucesión de pasos que bajan cada vez menos puede estancarse lejos del mínimo.
- **Usar una dirección que no es de descenso.** Si $\nabla f^\top \mathbf{d} \ge 0$, el retroceso nunca encuentra un paso aceptable.
- **Empezar siempre con un paso diminuto.** El retroceso solo acorta; si $\alpha_0$ ya es muy pequeño, se acepta de inmediato un paso ineficiente.

:::figura[Con c₁ = 0.9 la recta de Armijo casi coincide con la tangente: se rechazan 0.3, 0.15, 0.075 y 0.0375, y solo se acepta α = 0.0188, un paso cinco veces más corto que el óptimo.]{componente="OptimizerRace"}
```yaml
modo: busqueda-lineal
funciones: [cuadratica]
inicio: [3, 1.5]
alfa0: 0.3
c1: 0.9
rho: 0.5
```
:::

## Conexiones

Elige el paso del [[descenso-de-gradiente]] en lugar de una [[tasa-de-aprendizaje]] fija, mirando la función a lo largo de una dirección como en la [[derivada-direccional]]. Es parte de los [[metodos-cuasi-newton]] y del [[gradiente-conjugado]], que usa búsquedas exactas o casi exactas. En el [[metodo-de-newton]] amortiguado se usa para garantizar el descenso lejos del mínimo.

## Formulario

:::formula[Condición de Armijo]
$$
f(\mathbf{x} + \alpha\mathbf{d}) \le f(\mathbf{x}) + c_1\alpha\,\nabla f(\mathbf{x})^\top \mathbf{d}
$$

- $\alpha$: paso; $\mathbf{d}$: dirección de descenso; $c_1 \in (0, 1)$.
:::

:::formula[Condición de curvatura]
$$
\nabla f(\mathbf{x} + \alpha\mathbf{d})^\top \mathbf{d} \ge c_2\,\nabla f(\mathbf{x})^\top \mathbf{d}
$$

- $c_2 \in (c_1, 1)$: tolerancia sobre la pendiente final.
:::

:::formula[Retroceso]
$$
\alpha \in \{\alpha_0, \rho\alpha_0, \rho^2\alpha_0, \dots\}
$$

- $\alpha_0$: paso inicial; $\rho \in (0, 1)$: factor de reducción.
:::

:::formula[Paso exacto en una cuadrática]
$$
\alpha^* = -\frac{\nabla f(\mathbf{x})^\top \mathbf{d}}{\mathbf{d}^\top \mathbf{A}\,\mathbf{d}}
$$

- $\mathbf{A}$: hessiana de la cuadrática $\tfrac{1}{2}\mathbf{x}^\top \mathbf{A}\mathbf{x} - \mathbf{b}^\top \mathbf{x}$.
:::
