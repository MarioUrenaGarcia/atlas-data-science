---
id: longitud-minima-de-descripcion
titulo: Longitud mínima de descripción (MDL)
titulo_en: Minimum description length (MDL)
alias:
  - MDL
  - principio de longitud mínima de descripción
  - código de dos partes
modulo: 0
submodulo: '0.8'
orden: 18
nivel: avanzado
prerrequisitos:
  - teorema-de-codificacion-de-fuente
  - interpolacion-polinomial
etiquetas:
  - selección de modelos
  - compresión
  - sobreajuste
  - navaja de Occam
resumen: >
  El mejor modelo es el que permite describir los datos con menos bits, contando tanto los bits del
  modelo como los de los datos dado el modelo. Penaliza la complejidad y evita el sobreajuste.
formula: 'L(\text{datos}) = \min_{M} \big[L(M) + L(\text{datos} \mid M)\big], \qquad L(M_d) \approx \tfrac{d + 1}{2}\log_2 n'
visualizacion:
  componente: InformationViz
  parametros:
    modo: mdl
    ruido: 0.15
    semilla: 11
referencias:
  - clave: cover-thomas
    capitulo: '14'
  - clave: hastie-esl
    capitulo: '7.8'
publicado: true
---

## Intuición

Para enviar por teléfono una lista de treinta mediciones se puede dictar cada número, o bien dictar una fórmula que las aproxime y después solo las pequeñas correcciones. Si la fórmula es buena, las correcciones son números pequeños que se dictan rápido. Pero la fórmula también cuesta: una con muchos coeficientes tarda en dictarse.

El principio de longitud mínima de descripción elige el modelo que minimiza el total: los bits para describir el modelo más los bits para describir los datos usando el modelo. Un modelo demasiado simple deja correcciones grandes; uno demasiado complejo describe hasta el ruido, pero paga cada coeficiente extra. El mínimo queda en el modelo que captura la regularidad de los datos y nada más, una versión cuantitativa de la navaja de Occam.

La conexión con la compresión es directa: por el teorema de codificación de fuente, describir algo de probabilidad $q$ cuesta $-\log_2 q$ bits, así que acortar la descripción es lo mismo que darle más probabilidad a los datos.

## Definición

:::definicion[Código de dos partes]
Sea $\mathcal{M}$ una familia de modelos para los datos $D$. La longitud de descripción con el modelo $M \in \mathcal{M}$ es
$$
L(D, M) = L(M) + L(D \mid M), \qquad L(D \mid M) = -\log_2 P(D \mid M),
$$
y el principio MDL elige $\hat{M} = \arg\min_{M \in \mathcal{M}} L(D, M)$.
:::

Para regresión polinomial de grado $d$ con $n$ puntos y errores normales, una aproximación usual es
$$
L(M_d) \approx \tfrac{d + 1}{2}\log_2 n, \qquad L(D \mid M_d) \approx \tfrac{n}{2}\log_2 \frac{\mathrm{RSS}_d}{n} + \text{constante},
$$
que coincide, salvo un factor, con el criterio de información bayesiano.

:::nota[Qué significa cada símbolo]
- $D$: datos; $n$: número de observaciones.
- $M$: modelo; $\mathcal{M}$: familia de modelos; $\hat{M}$: el elegido.
- $L(M)$: bits para describir el modelo.
- $L(D \mid M)$: bits para describir los datos con el modelo.
- $P(D \mid M)$: probabilidad de los datos según el modelo.
- $d$: grado del polinomio; $M_d$: modelo polinomial de grado $d$.
- $\mathrm{RSS}_d$: suma de cuadrados de los residuos del ajuste de grado $d$.
:::

## Cómo usar la visualización

A la izquierda están treinta puntos generados por el polinomio $x^3 - x$ más ruido normal, con el polinomio ajustado por mínimos cuadrados del grado actual. A la derecha, una barra por grado: la parte inferior son los bits de los residuos y la superior, los bits del modelo; la altura total es la longitud de descripción, medida desde una constante común. La reproducción sube el grado de 0 a 8 y la semilla cambia el ruido.

Con la semilla 11 y ruido 0.15, el total baja de 48.8 bits con grado 0 a 36.6 con grado 1, sube un poco con grado 2 y cae a 15.0 con grado 3. A partir de ahí los residuos casi no bajan y el modelo agrega 2.5 bits por grado, así que el total vuelve a subir hasta 22.1 con grado 8. El mínimo, señalado con la etiqueta "mín" sobre su barra, está en el grado 3.

## Ejemplo

Con $n = 30$ puntos, cada coeficiente cuesta $\tfrac{1}{2}\log_2 30 = 2.454$ bits.

1. Grado 1: el modelo cuesta $2 \cdot 2.454 = 4.9$ bits y los residuos, 31.7 bits sobre la constante común; total 36.6.
2. Grado 3: el modelo cuesta $4 \cdot 2.454 = 9.8$ bits y los residuos, 5.2; total 15.0.
3. Grado 6: el modelo cuesta $7 \cdot 2.454 = 17.2$ bits y los residuos, 0.2; total 17.3.
4. El grado 6 ajusta los puntos mejor que el 3, pero los 26.5 bits de residuos que ahorra el grado 3 frente al grado 1 no tienen equivalente: pasar de 3 a 6 ahorra solo 5 bits de residuos y cuesta 7.4 de modelo.

:::figura[Ruido 0.3, el doble: los residuos pesan menos en comparación con el modelo, los totales para los grados 0 a 3 son 27.3, 21.5, 23.9 y 15.0 bits, y el mínimo sigue en el grado 3.]{componente="InformationViz"}
```yaml
modo: mdl
ruido: 0.3
semilla: 11
```
:::

## Propiedades

- **Compromiso entre ajuste y complejidad:** $L(D \mid M)$ baja con la complejidad del modelo y $L(M)$ sube; el total tiene un mínimo interior.
- **Consistencia:** si los datos vienen de un modelo de la familia, con suficientes datos MDL lo elige con probabilidad que tiende a uno.
- **Relación con BIC:** con la aproximación $\tfrac{k}{2}\log n$ para $k$ parámetros, MDL y el criterio de información bayesiano eligen el mismo modelo.

:::figura[Ruido 0.05, datos casi exactos: los residuos del grado 1 cuestan 70.6 bits y caen a 5.2 con el grado 3, una diferencia enorme frente al costo de los coeficientes, y el mínimo vuelve a estar en el grado 3.]{componente="InformationViz"}
```yaml
modo: mdl
ruido: 0.05
semilla: 11
```
:::

- **Interpretación bayesiana:** si $L(M) = -\log_2 P(M)$, minimizar la longitud total equivale a maximizar la probabilidad posterior $P(M \mid D)$.
- **Versiones refinadas:** el código de dos partes es la forma más simple; la MDL moderna usa códigos universales, como la verosimilitud máxima normalizada.

## Errores comunes

- **Elegir el modelo con menor error de ajuste.** El error de los residuos siempre baja al aumentar el grado; con la semilla 11, el grado 8 los describe con menos bits que el grado 3, pero su total es 7.0 bits mayor.
- **Olvidar que las longitudes solo se comparan dentro de la misma convención.** Los bits de los residuos incluyen una constante que depende de la precisión de los datos; es la misma para todos los grados y se cancela al comparar, pero no tiene sentido como cantidad absoluta.
- **Pensar que MDL garantiza encontrar el modelo verdadero con pocos datos.** Con pocos puntos el ruido puede inclinar la balanza hacia un modelo más simple o más complejo que el que generó los datos.

:::figura[Semilla 5 con ruido 0.15: el grado 4 totaliza 13.0 bits y el grado 3, el verdadero, 13.2; con 30 puntos la diferencia es tan pequeña que MDL elige un grado de más.]{componente="InformationViz"}
```yaml
modo: mdl
ruido: 0.15
semilla: 5
```
:::

- **Confundir la longitud de descripción con el tamaño del archivo de un programa.** Es una longitud de código idealizada, $-\log_2$ de una probabilidad, no una cuenta de caracteres.

## Conexiones

Se apoya en el [[teorema-de-codificacion-de-fuente]], que iguala longitudes de código con $-\log_2$ de probabilidades, y en el [[contenido-de-informacion]] de los datos según el modelo. El ajuste polinomial de la visualización extiende la [[interpolacion-polinomial]] a mínimos cuadrados, y la elección entre grados es el problema de sobreajuste que la [[perplejidad]] y la [[entropia-cruzada]] miden con datos de prueba.

## Formulario

:::formula[Código de dos partes]
$$
L(D, M) = L(M) + L(D \mid M)
$$

- $D$: datos; $M$: modelo; $L(M)$: bits del modelo; $L(D \mid M)$: bits de los datos dado el modelo.
:::

:::formula[Bits de los datos dado el modelo]
$$
L(D \mid M) = -\log_2 P(D \mid M)
$$

- $P(D \mid M)$: probabilidad que el modelo asigna a los datos.
:::

:::formula[Regresión polinomial]
$$
L(D, M_d) \approx \tfrac{d + 1}{2}\log_2 n + \tfrac{n}{2}\log_2\frac{\mathrm{RSS}_d}{n}
$$

- $d$: grado; $n$: número de puntos; $\mathrm{RSS}_d$: suma de cuadrados de los residuos; la igualdad es salvo una constante común a todos los grados.
:::
