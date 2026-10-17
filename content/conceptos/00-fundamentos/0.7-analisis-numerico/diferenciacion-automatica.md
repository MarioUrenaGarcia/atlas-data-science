---
id: diferenciacion-automatica
titulo: Diferenciación automática (modos forward y reverse)
titulo_en: Automatic differentiation (forward and reverse modes)
alias:
  - autodiff
  - diferenciación algorítmica
  - modo hacia adelante
  - modo hacia atrás
  - retropropagación
modulo: 0
submodulo: '0.7'
orden: 14
nivel: intermedio
prerrequisitos:
  - regla-de-la-cadena-multivariable
relaciones:
  - tipo: contrasta
    id: diferenciacion-numerica
etiquetas:
  - derivadas exactas
  - grafo computacional
  - regla de la cadena
  - gradientes
resumen: >
  La diferenciación automática aplica la regla de la cadena a cada operación elemental de un programa. El
  modo hacia adelante da una derivada por recorrido; el modo hacia atrás da el gradiente completo en uno.
formula: '\dot{v}_k = \sum_{j \to k} \frac{\partial v_k}{\partial v_j}\,\dot{v}_j, \qquad \bar{v}_j = \sum_{j \to k} \bar{v}_k\,\frac{\partial v_k}{\partial v_j}'
visualizacion:
  componente: NumericsLab
  parametros:
    modo: autodiff
    x1: 2
    x2: 3
    sentido: reverse
referencias:
  - clave: goodfellow
    capitulo: '6.5'
publicado: true
---

## Intuición

Todo programa que calcula una función, por complicado que sea, está hecho de operaciones elementales: sumas, productos, senos, exponenciales. Cada una tiene una derivada conocida. La diferenciación automática registra la cadena de operaciones y aplica la regla de la cadena a cada eslabón, de modo que obtiene la derivada exacta del programa, sin fórmulas simbólicas y sin el error de paso de las diferencias finitas.

Hay dos maneras de recorrer la cadena. Hacia adelante, se lleva junto con cada valor su derivada respecto a una entrada elegida; al terminar se tiene la derivada de la salida respecto a esa entrada, y para otra entrada hay que repetir el recorrido. Hacia atrás, primero se calcula la función y luego se recorre la cadena desde la salida, acumulando cuánto afecta cada valor intermedio al resultado; al llegar a las entradas se tienen todas las derivadas parciales a la vez. Para una pérdida con millones de parámetros, el modo hacia atrás da el gradiente completo al costo de unas pocas evaluaciones de la función: es la retropropagación de las redes neuronales.

## Definición

Se escribe el cálculo como una sucesión de variables intermedias $v_1, \dots, v_N$: las primeras son las entradas y cada $v_k$ es una operación elemental de variables anteriores; la salida es $v_N$.

:::definicion[Modos de la diferenciación automática]
- **Hacia adelante (forward):** para una dirección de entrada, se define la tangente $\dot{v}_k = \dfrac{\partial v_k}{\partial x_s}$ y se propaga en el mismo orden del cálculo:
$$
\dot{v}_k = \sum_{j:\ v_j \to v_k} \frac{\partial v_k}{\partial v_j}\,\dot{v}_j.
$$
- **Hacia atrás (reverse):** se define el adjunto $\bar{v}_j = \dfrac{\partial v_N}{\partial v_j}$, con $\bar{v}_N = 1$, y se propaga en orden inverso:
$$
\bar{v}_j = \sum_{k:\ v_j \to v_k} \bar{v}_k\,\frac{\partial v_k}{\partial v_j}.
$$
:::

Para $f : \mathbb{R}^n \to \mathbb{R}^m$, el modo hacia adelante calcula una columna de la jacobiana por recorrido y el modo hacia atrás una fila. Para un gradiente, con $m = 1$ y $n$ grande, el modo hacia atrás es el indicado.

:::nota[Qué significa cada símbolo]
- $v_1, \dots, v_N$: variables intermedias del cálculo; $v_N$: salida.
- $v_j \to v_k$: $v_j$ es un argumento de la operación que produce $v_k$.
- $x_s$: entrada elegida para el modo hacia adelante.
- $\dot{v}_k$: tangente, derivada de $v_k$ respecto a $x_s$.
- $\bar{v}_j$: adjunto, derivada de la salida respecto a $v_j$.
- $n$, $m$: número de entradas y de salidas de $f$.
:::

## Cómo usar la visualización

Las tarjetas son los nodos del grafo de $f(x_1, x_2) = x_1 x_2 + \operatorname{sen} x_1$: $v_1 = x_1$, $v_2 = x_2$, $v_3 = v_1 v_2$, $v_4 = \operatorname{sen} v_1$ y $v_5 = v_3 + v_4$. Cada una muestra su valor y su tangente o su adjunto. La reproducción calcula un nodo por paso, en orden de cálculo hacia adelante y en orden inverso hacia atrás, y el encabezado escribe la regla de la cadena del nodo actual con sus números. Los controles cambian el modo, la entrada respecto a la que se deriva y los valores de $x_1$ y $x_2$.

Hacia atrás, al llegar a $v_1$ y $v_2$ se tienen las dos derivadas parciales. Hacia adelante, hace falta cambiar la entrada y repetir para obtener la segunda.

## Ejemplo

Se deriva $f(x_1, x_2) = x_1 x_2 + \operatorname{sen} x_1$ en $(2, 3)$.

1. Valores: $v_3 = 6$, $v_4 = \operatorname{sen} 2 = 0.909297$, $v_5 = 6.909297$.
2. Hacia adelante respecto a $x_1$: $\dot{v}_1 = 1$, $\dot{v}_2 = 0$, $\dot{v}_3 = 1 \cdot 3 + 2 \cdot 0 = 3$, $\dot{v}_4 = \cos 2 \cdot 1 = -0.416147$, $\dot{v}_5 = 2.583853$.
3. Hacia atrás: $\bar{v}_5 = 1$, $\bar{v}_3 = \bar{v}_4 = 1$, $\bar{v}_2 = \bar{v}_3\,v_1 = 2$ y $\bar{v}_1 = \bar{v}_3\,v_2 + \bar{v}_4\cos v_1 = 3 - 0.416147 = 2.583853$.
4. El gradiente es $(2.583853, 2)$, que coincide con $\big(x_2 + \cos x_1,\ x_1\big)$ evaluado en $(2, 3)$.
5. El modo hacia atrás obtuvo las dos componentes en un recorrido; el modo hacia adelante necesita uno por entrada.

:::figura[El modo hacia adelante en $(2, 3)$ respecto a $x_1$: las tangentes pasan de las entradas a la salida, 1, 0, 3, $-0.416147$ y $2.583853$; esta última es $\partial f/\partial x_1$.]{componente="NumericsLab"}
```yaml
modo: autodiff
x1: 2
x2: 3
sentido: forward
```
:::

## Propiedades

- **Exactitud:** el resultado es la derivada exacta del programa, salvo el redondeo de cada operación; no hay error de truncamiento ni paso que elegir.

:::figura[En $(1, -1)$ el modo hacia atrás da el gradiente $(x_2 + \cos x_1,\ x_1) = (-0.459698, 1)$ en un solo recorrido desde la salida.]{componente="NumericsLab"}
```yaml
modo: autodiff
x1: 1
x2: -1
sentido: reverse
```
:::

- **Costo del modo hacia adelante:** cada recorrido cuesta unas pocas veces una evaluación de $f$ y da una columna de la jacobiana.
- **Costo del modo hacia atrás:** el gradiente de una función escalar cuesta unas pocas evaluaciones de $f$, sin importar el número de entradas, pero requiere guardar los valores intermedios.
- **Números duales:** el modo hacia adelante se implementa con números $a + b\epsilon$, $\epsilon^2 = 0$, cuya parte $b$ lleva la derivada.
- **Composición:** las derivadas de bloques enteros, como una multiplicación de matrices, se pueden definir a mano y combinar con las demás.

## Errores comunes

- **Confundirla con la diferenciación simbólica.** No construye una fórmula de la derivada; calcula su valor numérico en el punto, siguiendo el programa.

:::figura[En $(0.5, 2)$, hacia adelante respecto a $x_1$, la derivada que llega a $v_5$ es $2 + \cos 0.5 = 2.877583$, igual a la fórmula exacta en todas sus cifras, sin elegir ningún paso.]{componente="NumericsLab"}
```yaml
modo: autodiff
x1: 0.5
x2: 2
sentido: forward
```
:::

- **Confundirla con las diferencias finitas.** Las diferencias finitas aproximan con error de truncamiento y de redondeo; la diferenciación automática no depende de un paso.
- **Usar el modo hacia adelante para gradientes grandes.** Con un millón de parámetros haría falta un millón de recorridos.
- **Olvidar la memoria del modo hacia atrás.** Guardar todos los valores intermedios de un cálculo largo puede ser el factor limitante; se recalculan partes para ahorrar memoria.

## Conexiones

Es la [[regla-de-la-cadena-multivariable]] aplicada operación por operación, organizada con la [[matriz-jacobiana]]. Reemplaza a la [[diferenciacion-numerica]] cuando el código de la función está disponible, y el modo hacia atrás da los gradientes que usan el [[descenso-de-gradiente]] y la [[optimizacion-estocastica]].

## Formulario

:::formula[Propagación de tangentes]
$$
\dot{v}_k = \sum_{j:\ v_j \to v_k} \frac{\partial v_k}{\partial v_j}\,\dot{v}_j
$$

- $\dot{v}$: tangentes; empieza con $\dot{x}_s = 1$ y las demás entradas en 0.
:::

:::formula[Propagación de adjuntos]
$$
\bar{v}_j = \sum_{k:\ v_j \to v_k} \bar{v}_k\,\frac{\partial v_k}{\partial v_j}, \qquad \bar{v}_N = 1
$$

- $\bar{v}$: adjuntos; al terminar, $\bar{x}_i = \partial f/\partial x_i$.
:::

:::formula[Gradiente del ejemplo]
$$
\nabla f(x_1, x_2) = \big(x_2 + \cos x_1,\ x_1\big)
$$

- $f(x_1, x_2) = x_1 x_2 + \operatorname{sen} x_1$.
:::

:::formula[Números duales]
$$
f(a + b\epsilon) = f(a) + f'(a)\,b\,\epsilon, \qquad \epsilon^2 = 0
$$

- $a$: valor; $b$: tangente; $\epsilon$: unidad infinitesimal.
:::
