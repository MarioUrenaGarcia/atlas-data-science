---
id: error-de-redondeo-y-error-de-truncamiento
titulo: Error de redondeo y error de truncamiento
titulo_en: Round-off error and truncation error
alias:
  - error de redondeo
  - error de truncamiento
  - error de discretización
modulo: 0
submodulo: '0.7'
orden: 2
nivel: intermedio
prerrequisitos:
  - representacion-de-punto-flotante
  - serie-de-taylor-y-de-maclaurin
etiquetas:
  - error numérico
  - redondeo
  - truncamiento
  - paso óptimo
resumen: >
  El error de truncamiento viene de cambiar un proceso infinito o un límite por uno finito; el de redondeo,
  de guardar cada número con precisión finita. Al refinar un método el primero baja y el segundo puede subir.
formula: '\text{error total} \approx \underbrace{C_1 h^{k}}_{\text{truncamiento}} + \underbrace{C_2\,\frac{\varepsilon}{h}}_{\text{redondeo}}'
visualizacion:
  componente: NumericsLab
  parametros:
    modo: error-paso
    funcion: seno
    x0: 1
    esquema: adelante
referencias:
  - clave: goodfellow
    capitulo: '4'
publicado: true
---

## Intuición

Para estimar la velocidad de un automóvil con dos lecturas del odómetro se divide la distancia recorrida entre el tiempo. Si las lecturas están separadas por una hora, el resultado es la velocidad promedio de esa hora, no la del instante: ese es un error de truncamiento, el que se comete al cambiar un límite por una cantidad finita. Acortar el intervalo lo reduce.

Pero el odómetro marca con cierta resolución. Si las lecturas están separadas por un segundo, la distancia recorrida es diminuta y la incertidumbre de la lectura, dividida entre un segundo, se vuelve enorme: ese es un error de redondeo, el que viene de trabajar con números de precisión limitada. En la computadora pasa lo mismo con el épsilon de máquina. Al refinar un método numérico los dos errores tiran en sentidos contrarios, y el mejor resultado se obtiene con un paso intermedio, no con el más pequeño posible.

## Definición

Para aproximar una cantidad $A$ con un método que depende de un parámetro $h$, como el paso de una diferencia o el ancho de una partición, el error se separa en dos partes:

:::definicion[Error de truncamiento y error de redondeo]
- **Truncamiento:** $A - A_h$, la diferencia entre el valor exacto y el que daría el método en aritmética exacta. Suele comportarse como $C_1 h^{k}$, donde $k$ es el **orden** del método.
- **Redondeo:** $A_h - \tilde{A}_h$, la diferencia entre el resultado en aritmética exacta y el calculado en punto flotante, $\tilde{A}_h$. Es del orden del épsilon de máquina multiplicado por cuánto amplifica el método los errores de sus datos.
:::

Por ejemplo, en la diferencia hacia adelante $\dfrac{f(x + h) - f(x)}{h}$, el desarrollo de Taylor da un truncamiento $\tfrac{1}{2}f''(\xi)\,h$, y el redondeo de $f(x + h)$ y $f(x)$, de tamaño $\varepsilon|f(x)|$, se divide entre $h$:
$$
\text{error total} \approx \frac{|f''(x)|}{2}\,h + \frac{2\varepsilon\,|f(x)|}{h},
$$
que es mínimo cerca de $h^* = 2\sqrt{\varepsilon\,|f(x)|/|f''(x)|}$, del orden de $10^{-8}$ en precisión doble.

:::nota[Qué significa cada símbolo]
- $A$: cantidad exacta que se quiere calcular; $A_h$: resultado del método en aritmética exacta; $\tilde{A}_h$: resultado calculado en la computadora.
- $h$: parámetro de discretización, como un paso o un ancho.
- $k$: orden del método; $C_1$, $C_2$: constantes que dependen de la función.
- $\varepsilon$: épsilon de máquina.
- $f''(\xi)$: segunda derivada en un punto $\xi$ entre $x$ y $x + h$.
- $h^*$: paso que minimiza el error total.
:::

## Cómo usar la visualización

La gráfica usa escala logarítmica en los dos ejes: el paso $h = 10^k$ va de 1 a $10^{-16}$ y la altura es el logaritmo del error de la derivada numérica. La línea azul es el error medido; las punteadas son el modelo de truncamiento, que baja hacia la izquierda, y el de redondeo, que sube. La reproducción recorre los pasos y el encabezado escribe el cociente, su error y los dos términos del modelo. El control cambia entre la diferencia hacia adelante y la centrada.

Conforme $h$ baja de 1 a $10^{-8}$, el error baja con pendiente 1; a partir de ahí se vuelve ruidoso y sube. Con la diferencia centrada la pendiente es 2 y el mínimo se alcanza antes, cerca de $10^{-5}$.

## Ejemplo

Se aproxima la derivada de $e^x$ en $x = 1$, cuyo valor exacto es $e = 2.718281828\ldots$, con la diferencia hacia adelante.

1. Con $h = 0.1$: $\dfrac{e^{1.1} - e}{0.1} = 2.858842$, error $0.1406$.
2. Con $h = 0.01$: error $0.01364$, unas diez veces menor; el modelo de truncamiento predice $\tfrac{e}{2}\cdot 0.01 = 0.01359$.
3. Con $h = 10^{-4}$: error $1.36 \times 10^{-4}$. El truncamiento sigue dominando y baja con $h$.
4. Con $h = 10^{-8}$: error $6.6 \times 10^{-9}$, cerca del paso óptimo $h^* = 2\sqrt{\varepsilon} \approx 3 \times 10^{-8}$.
5. Con $h = 10^{-12}$: el error sube a $4.3 \times 10^{-4}$. El numerador $e^{1 + h} - e$ es del tamaño de unas pocas separaciones entre números de punto flotante y al dividir entre $h$ se amplifica el redondeo.

:::figura[La derivada de $e^x$ en 1 con $h = 0.01$: el error medido, 0.0136, está sobre la línea del truncamiento, muy por encima de la de redondeo. La reproducción sigue bajando el paso y muestra dónde se cruzan.]{componente="NumericsLab"}
```yaml
modo: error-paso
funcion: exponencial
x0: 1
esquema: adelante
paso: -2
```
:::

## Propiedades

- **Orden de un método:** si el truncamiento es $C h^{k}$, reducir $h$ a la mitad lo divide entre $2^{k}$; en escala logarítmica la gráfica del error es una recta de pendiente $k$.
- **Paso óptimo:** con truncamiento $C_1h^k$ y redondeo $C_2\varepsilon/h$, el error total es mínimo en $h^* \propto \varepsilon^{1/(k+1)}$ y vale del orden de $\varepsilon^{k/(k+1)}$; más orden permite más exactitud.

:::figura[La diferencia centrada en $\operatorname{sen} x$ en 1, de orden 2: el error baja con pendiente 2 y el mínimo está cerca de $h = 10^{-5}$, donde alcanza unos $10^{-11}$, mucho mejor que el $10^{-8}$ de la diferencia hacia adelante.]{componente="NumericsLab"}
```yaml
modo: error-paso
funcion: seno
x0: 1
esquema: centrada
paso: -5
```
:::

- **Origen distinto:** el truncamiento existe aunque la aritmética sea exacta; el redondeo existe aunque el método sea exacto.
- **Cancelación:** restar números casi iguales conserva su error absoluto pero reduce el resultado, y el error relativo crece en proporción.

## Errores comunes

- **Tomar el paso más pequeño posible.** Por debajo de $h^*$ el error crece; con $h = 10^{-13}$ la derivada de $e^x$ en 1 se equivoca desde la cuarta cifra.

:::figura[$h = 10^{-13}$ en la diferencia hacia adelante de $e^x$: el punto queda sobre la línea creciente del redondeo, con un error de $4.6 \times 10^{-4}$, unas 70 mil veces mayor que el del paso óptimo.]{componente="NumericsLab"}
```yaml
modo: error-paso
funcion: exponencial
x0: 1
esquema: adelante
paso: -13
```
:::

- **Atribuir todo error a la precisión de la máquina.** Con $h = 0.1$ el error de 0.14 es de truncamiento; usar más bits no lo reduce.
- **Confundir error absoluto y relativo.** Un error de $10^{-6}$ es despreciable en una distancia de mil kilómetros y enorme en una de un micrómetro.
- **Suponer que el error de redondeo siempre es aleatorio y se cancela.** En sumas largas con el mismo signo los errores se acumulan.

## Conexiones

El truncamiento se calcula con la [[serie-de-taylor-y-de-maclaurin]] y el redondeo con el modelo de la [[representacion-de-punto-flotante]]. La competencia entre ambos decide el paso de la [[diferenciacion-numerica]] y de los [[metodos-numericos-para-ecuaciones-diferenciales]]. Que un algoritmo no amplifique el redondeo es el tema de la [[estabilidad-numerica]].

## Formulario

:::formula[Descomposición del error]
$$
A - \tilde{A}_h = \underbrace{(A - A_h)}_{\text{truncamiento}} + \underbrace{(A_h - \tilde{A}_h)}_{\text{redondeo}}
$$

- $A$: valor exacto; $A_h$: método en aritmética exacta; $\tilde{A}_h$: resultado calculado.
:::

:::formula[Error de la diferencia hacia adelante]
$$
\left|\frac{\mathrm{fl}(f(x + h)) - \mathrm{fl}(f(x))}{h} - f'(x)\right| \lesssim \frac{|f''(x)|}{2}h + \frac{2\varepsilon|f(x)|}{h}
$$

- $h$: paso; $\varepsilon$: épsilon de máquina; $\mathrm{fl}$: valor guardado en punto flotante.
:::

:::formula[Paso óptimo]
$$
h^* = 2\sqrt{\frac{\varepsilon\,|f(x)|}{|f''(x)|}}
$$

- $h^*$: paso que minimiza la suma de los dos errores en la diferencia hacia adelante.
:::

:::formula[Orden de un método]
$$
A - A_h \approx C h^{k}
$$

- $k$: orden; $C$: constante que depende del problema.
:::
